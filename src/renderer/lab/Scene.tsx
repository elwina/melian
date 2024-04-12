import { useEffect, useRef, useState } from 'react';
import { DraftFunction, useImmer } from 'use-immer';
import { ElectronHandler } from 'main/preload';
import { sReg } from 'renderer/screens/sReg';
import { mReg } from 'renderer/measures/mReg';
import { Button, ConfigProvider, theme, Tour, TourProps } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import FrontPage from 'renderer/front/Frontpage';
import { Welcome } from 'renderer/welcome/Welcome';
import Holder from './Holder';
import 'antd/dist/reset.css';
import { InstrumentConfig, StyleConfig } from '../typing/config.type';
import LenGene from './LenGene';
import Ctrl from './Ctrl';
import LoadSetting from '../setting/LoadSetting';
import SwitchExp from '../experiment/switchExp';
import young from '../experiment/json/young.melian.json';

export default function Scene() {
  let ipcRenderer: ElectronHandler['ipcRenderer'] | null;
  try {
    ipcRenderer = window.electron.ipcRenderer
      ? window.electron.ipcRenderer
      : null;
  } catch {
    ipcRenderer = null;
  }
  const web = !ipcRenderer;

  const [exp, setExp] = useState<string>('杨氏双缝干涉');

  const [styleConfig, setStyleConfig] = useImmer<StyleConfig>({
    global: {
      dark: false,
      ifNotStyle: true,
      showTooltip: true,
      front: true,
      welcome: true,
      guide: false,
      expOpen: false,
      primaryColor: '#1677ff',
      english: false,
    },
    holder: {
      leftMargin: 50,
      bottomMargin: 185,
      holderHeight: 28,
      holderWidthmm: 1000,
      leftPadding: 10,
      xScale: 1.1,
      upHeight: 246,
      fontSize: 18,
      baselineHeight: 116,
      lenScaleX: 2,
      lenScaleY: 2.6,
    },
    setting: {
      height: 110,
      expHeight: 120,
    },
    screen: {
      FixedCircle: {
        mm2px: 10,
        scaleX: 1.2,
        scaleY: 1.2,
        leftMargin: 205,
        bottomMargin: 515,
      },
      FixedCirclePolar: {
        mm2px: 6,
        scaleX: 3,
        scaleY: 3,
        leftMargin: 205,
        bottomMargin: 515,
      },
      Board: {
        mm2px: 2,
        totalWidthmm: 200,
        totalHeightmm: 50,
        scaleX: 3,
        scaleY: 3,
        leftMargin: 205,
        bottomMargin: 515,
      },
      BoardPolar: {
        px2mm: 1,
        totalWidthmm: 120,
        totalHeightmm: 120,
        scaleX: 3,
        scaleY: 3,
        leftMargin: 205,
        bottomMargin: 515,
      },
      FastBoard: {
        mm2px: 2,
        totalWidthmm: 200,
        totalHeightmm: 50,
        scaleX: 3,
        scaleY: 3,
        leftMargin: 205,
        bottomMargin: 515,
      },
      FastBoardUni: {
        mm2px: 1,
        totalWidthmm: 120,
        totalHeightmm: 120,
        scaleX: 3,
        scaleY: 3,
        leftMargin: 205,
        bottomMargin: 515,
      },
    },
    measure: {
      Square: {
        mm2px: 5.5,

        upHeight: 42,
        downHeight: 44,
        dsHeight: 39,
        fontHeight: 20,
        sfontHeight: 20,

        fontSize: 20,
        sfontSize: 16,
        lineWidth: 2,
        leftPadding: 12,
        upPadding: 5,

        leftMargin: 660,
        bottomMargin: 415,
      },
      Circle: {
        mm2px: 8,
        hm2px: 10,

        seeSize: 300,
        bigHeight: 250,
        leftPadding: 20,

        mainLine: 20,
        hLine: 40,
        lineWidth: 2,
        mFontSize: 20,
        hFontSize: 16,

        leftMargin: 700,
        bottomMargin: 520,
      },
    },
  });

  const [instrumentConfig, setInstrumentConfig] = useImmer<InstrumentConfig>(
    young as InstrumentConfig
  );

  const RenderMeasure = mReg[instrumentConfig.measure.type];
  const RenderScreen = sReg[instrumentConfig.screen.type];

  // darkmode
  useEffect(() => {
    document.getElementsByTagName('body')[0].className = styleConfig.global.dark
      ? 'dark-mode'
      : 'light-mode';
  }, [styleConfig.global.dark]);

  // 导览页面
  // 仅适用于杨氏双缝
  const steps: TourProps['steps'] = [
    {
      title: '欢迎使用',
      description:
        '欢迎来到波动光学演示系统! 作为物理学的一个重要学科分支，光学研究的发展完全符合以下认知规律：在观察和实验的基础上，对物理现象进行分析、抽象和综合，进而提出假说，形成理论，并不断反复经受实践的检验。光学的学习是需要实验为基础的。而本软件旨在通过模拟光的干涉、光的衍射和光的偏振中重要的实验，允许操作者改变参数、可视化地输出模拟结果，使学生对波动光学有更深的理解和掌握。本软件预期为广大师生提供优质的教学资源。如有不妥之处，请各位多多指正。',
      target: null,
    },
    {
      title: '讲解页面',
      description: '这是讲解页面，您可以在这里播放教学PPT',
      target: () => document.getElementById('ppt')!,
      placement: 'center',
      type: 'primary',
    },
    {
      title: '左右翻页',
      description: '您可以通过点击左右箭头来翻页',
      target: () =>
        document.getElementsByClassName('ppt-slider')?.item(0) as HTMLElement,
    },
    {
      title: '进入并定位',
      description:
        '您可以通过点击这个按钮来进入实验操作界面，程序会自动为您定位到最佳布局，您需要等待几秒钟',
      target: () =>
        document.getElementsByClassName('enter-btn')?.item(0) as HTMLElement,
      nextButtonProps: {
        onClick: () => {
          (
            document.getElementsByClassName('enter-btn')[0] as HTMLElement
          ).click();
        },
      },
    },
    {
      title: '定位中',
      description:
        '自动定位是需要时间的，程序将针对任何屏幕大小进行适配，您也可以在之后手动操控布局。请您在等待后方控件停止移动后，点击进入下一步',
      target: null,
      prevButtonProps: {
        onClick: () => {
          setStyleConfig((draft) => {
            draft.global.front = true;
          });
        },
      },
    },
    {
      title: '观察屏',
      description:
        '这是观察屏，您可以在这里观察干涉条纹，以及任何您想观察的现象',
      target: () => document.getElementById('screen')!,
    },
    {
      title: '测量头',
      description: '这是测量头，您可以在这里读取游标卡尺/螺旋测微器的读数',
      target: () => document.getElementById('measure')!,
    },
    {
      title: '光具座',
      description:
        '这是光具座，其上方是光具，下方是操作杆。下方显示的读数单位均为mm',
      target: () => document.getElementById('holder')!,
    },
    {
      title: '移动光具',
      description: '您可以通过拖动光具来调整光具的位置，按住小手拖动即可',
      target: () => document.getElementById('ctrl-5')!,
    },
    {
      title: '设置栏',
      description:
        '这是设置栏切换按钮，目前正处于参数调节模式，点击即可切换为样式调节。请点击进入下一步',
      target: () => document.getElementById('switchSetting')!,
      nextButtonProps: {
        onClick: () => {
          setStyleConfig((draft) => {
            draft.global.ifNotStyle = false;
          });
        },
      },
    },
    {
      title: '样式调节',
      description:
        '在这里您可以调节所有控件的样式，包括光具座、观察屏、测量头的位置尺寸大小等等',
      target: () => document.getElementById('setting')!,
      prevButtonProps: {
        onClick: () => {
          setStyleConfig((draft) => {
            draft.global.ifNotStyle = true;
          });
        },
      },
    },
    {
      title: '参数调节',
      description: '请再次点击切换栏目，切换至参数调节',
      target: () => document.getElementById('switchSetting')!,
      nextButtonProps: {
        onClick: () => {
          setStyleConfig((draft) => {
            draft.global.ifNotStyle = true;
          });
        },
      },
    },
    {
      title: '设置栏',
      description:
        '在下方设置栏，您可以调节实验的参数，包括光源波长、双缝间距、目镜位置等等',
      target: () => document.getElementById('setting')!,
      prevButtonProps: {
        onClick: () => {
          setStyleConfig((draft) => {
            draft.global.ifNotStyle = false;
          });
        },
      },
    },
    {
      title: '调整双缝间距',
      description:
        '您可以通过点击预设值调整双缝间距，也可以点击自定义，然后拖动滑块来调整双缝间距',
      target: () => document.getElementById('settings-1')!,
    },
    {
      title: '调整目镜位置',
      description:
        '您可以拖动下方的滚轮状横条，来粗调目镜位置。左边的柱状按钮显示的是粗调幅度，您可点击增大幅度',
      target: () => document.getElementById('settings-2')!,
    },
    {
      title: '更换测量头',
      description:
        '您可以通过点击这个按钮来更换测量头，目前支持游标卡尺和螺旋测微器',
      target: () => document.getElementById('settings-4')!,
      nextButtonProps: {
        onClick: () => {
          setInstrumentConfig((draft) => {
            draft.measure.type = 'Circle';
          });
        },
      },
    },
    {
      title: '快速工具栏',
      description:
        '这是快速工具栏，您可以在这里进行关灯、更换主题颜色、自动定位、返回PPT页等操作',
      target: () => document.getElementById('easyaction')!,
    },
    {
      title: '关灯',
      description: '您可以通过点击这个按钮来切换关灯模式，以便于观察干涉条纹',
      target: () => document.getElementById('turnoff')!,
    },
    {
      title: '自动定位',
      description: '每次切换实验或者调节窗口大小后，可以点击自动定位重定位',
      target: () => document.getElementById('autoResize')!,
    },
    {
      title: '导出/加载配置',
      description:
        '您可以通过点击这个按钮来导出/加载样式配置，以便记录下当前样式，这非常适合于课堂教学',
      target: () => document.getElementById('iostyle')!,
    },
    {
      title: '切换实验',
      description:
        '右侧的窗口可以切换实验，您也可以将实验配置文件放进程序目录，后点击出刷新来自定义实验',
      target: () =>
        document.getElementsByClassName('exp-select')[0] as HTMLElement,
    },
    {
      title: '教程结束',
      description: '引导教程到此结束，祝您使用愉快',
      target: null,
    },
  ];

  function changeExp(name: string, config: InstrumentConfig) {
    setExp(name);
    setInstrumentConfig(config);
    setStyleConfig((draft) => {
      draft.global.front = true;
      draft.global.dark = false;
      draft.global.welcome = false;
      if (/^[A-Za-z0-9]+$/.test(config.name)) {
        draft.global.english = true;
      } else {
        draft.global.english = false;
      }
    });
  }

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: styleConfig.global.dark
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,

          token: {
            colorPrimary: styleConfig.global.primaryColor,
          },
        }}
        locale={zhCN}
      >
        <LoadSetting
          styleConfig={styleConfig}
          instrumentConfig={instrumentConfig}
          setInstrumentConfig={setInstrumentConfig}
          setStyleConfig={setStyleConfig}
          setExp={(ename) => {
            setExp(ename);
          }}
        />
        <RenderScreen
          instrumentConfig={instrumentConfig}
          styleConfig={styleConfig}
        />

        {!styleConfig.global.dark && (
          <>
            <RenderMeasure
              instrumentConfig={instrumentConfig}
              styleConfig={styleConfig}
            />
            <Holder styleConfig={styleConfig} />
            <SwitchExp
              exp={exp}
              styleConfig={styleConfig}
              setStyleConfig={setStyleConfig}
              onChange={(name, config) => {
                changeExp(name, config);
                // setExp(name);
                // setInstrumentConfig(config);
                // setStyleConfig((draft) => {
                //   draft.global.front = true;
                // });
              }}
            />
          </>
        )}

        <LenGene
          instrumentConfig={instrumentConfig}
          styleConfig={styleConfig}
        />
        <Ctrl
          instrumentConfig={instrumentConfig}
          styleConfig={styleConfig}
          onchange={(id, d) => {
            setInstrumentConfig((draft) => {
              draft.lens[id].distancemm = d;
            });
          }}
        />

        {styleConfig.global.front && !styleConfig.global.english && (
          <FrontPage
            instrumentConfig={instrumentConfig}
            setInstrumentConfig={setInstrumentConfig}
            styleConfig={styleConfig}
            setStyleConfig={setStyleConfig}
          />
        )}

        <Tour
          steps={steps}
          zIndex={99999}
          open={styleConfig.global.guide}
          onClose={() => {
            setStyleConfig((draft) => {
              draft.global.guide = false;
            });
          }}
          onFinish={() => {
            setStyleConfig((draft) => {
              draft.global.guide = false;
            });
          }}
        />
        {styleConfig.global.welcome && (
          <Welcome
            instrumentConfig={instrumentConfig}
            setInstrumentConfig={setInstrumentConfig}
            styleConfig={styleConfig}
            setStyleConfig={setStyleConfig}
            onChange={(name, config) => {
              changeExp(name, config);
            }}
          />
        )}
      </ConfigProvider>
    </>
  );
}
