const { Client } = require("ssh2");
const fs = require("node:fs").promises;
const path = require("node:path");
const { promisify } = require("node:util");
require("dotenv").config({ path: ".env/tencent.env" });

// 连接信息
const serverConfig = {
  host: process.env.TENCENT_CLOUD_SERVER,
  port: 22,
  username: process.env.TENCENT_CLOUD_USER,
  password: process.env.TENCENT_CLOUD_KEY, // 或者使用私钥认证
};

const localBuildDir = path.join(__dirname, "../build/frontend");
const remoteUploadDir = "/srv/app/";

async function clearRemoteDirectory(sftp, remoteDir) {
  try {
    const readdir = sftp.readdir.bind(sftp);
    const list = await new Promise((resolve, reject) => {
      readdir(remoteDir, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (list.length === 0) return;

    const deletePromises = list.map(async (item) => {
      const remotePath = path.posix.join(remoteDir, item.filename);

      if (item.longname.startsWith("d")) {
        // 判断是否为目录
        await clearRemoteDirectory(sftp, remotePath);
        await new Promise((resolve, reject) =>
          sftp.rmdir(remotePath, (err) => (err ? reject(err) : resolve()))
        );
      } else {
        await new Promise((resolve, reject) =>
          sftp.unlink(remotePath, (err) => (err ? reject(err) : resolve()))
        );
      }
    });

    await Promise.all(deletePromises);
  } catch (err) {
    throw new Error(`Error clearing remote directory: ${err.message}`);
  }
}

async function uploadDirectory(sftp, localDir, remoteDir) {
  try {
    const files = await fs.readdir(localDir);

    for (const file of files) {
      const localFilePath = path.join(localDir, file);
      const remoteFilePath = path.posix.join(remoteDir, file);
      const stats = await fs.lstat(localFilePath);

      if (stats.isDirectory()) {
        // 远程目录不存在则创建
        await new Promise((resolve, reject) => {
          sftp.mkdir(remoteFilePath, (err) => {
            if (err && err.code !== 4) reject(err); // 忽略目录已存在的错误
            else resolve();
          });
        });

        // 递归上传子目录
        await uploadDirectory(sftp, localFilePath, remoteFilePath);
      } else {
        // 上传文件
        await new Promise((resolve, reject) => {
          sftp.fastPut(localFilePath, remoteFilePath, (err) => {
            if (err) reject(err);
            else {
              console.log(`${localFilePath} uploaded to ${remoteFilePath}`);
              resolve();
            }
          });
        });
      }
    }
  } catch (err) {
    throw new Error(`Error uploading directory: ${err.message}`);
  }
}

async function uploadFiles(localDir, remoteDir) {
  const conn = new Client();

  const connect = () =>
    new Promise((resolve, reject) => {
      conn.on("ready", resolve);
      conn.on("error", reject);
      conn.connect(serverConfig);
    });

  const sftp = () =>
    new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);
        else resolve(sftp);
      });
    });

  try {
    await connect();
    console.log("SSH Connection Ready");

    const sftpClient = await sftp();

    try {
      await clearRemoteDirectory(sftpClient, remoteDir);
      console.log("Remote directory cleared");
    } catch (err) {
      console.error(`Error clearing remote directory: ${err.message}`);
      throw err;
    }

    // 上传整个目录
    await uploadDirectory(sftpClient, localDir, remoteDir);

    console.log("All files and directories uploaded successfully");
  } catch (err) {
    console.error(`Error: ${err.message}`);
  } finally {
    conn.end(); // Ensure the connection is closed
  }
}

uploadFiles(localBuildDir, remoteUploadDir);
