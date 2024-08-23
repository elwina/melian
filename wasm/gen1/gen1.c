#include <stdio.h>
#include <string.h>
#include <math.h>
#include "tinyexpr.h"
#include "cie.h"
#include "tool.h"

static unsigned char re[1024 * 1024 * 4] = {0};
static te_expr *expr = NULL;
#define MAX_VAR_LEN 11
#define MAX_VAR_COUNT 30
static te_variable varList[MAX_VAR_COUNT];
static int varTotal;
static double storeVars[MAX_VAR_COUNT];
static char storeVarNames[MAX_VAR_COUNT][MAX_VAR_LEN];

#define MAX_WAVE 300
static int wave[MAX_WAVE];
static double instense[MAX_WAVE];

static double receiveVars[MAX_VAR_COUNT];

static double l_FastScreenBoard, y_FastScreenBoard;
static double x_FastScreenBoardUni, y_FastScreenBoardUni, r_FastScreenBoardUni, t_FastScreenBoardUni, l_FastScreenBoardUni;

int (*getPointWave())[]
{
  return &wave;
}

double (*getPointInstense())[]
{
  return &instense;
}

double (*getPointReceiveVars())[]
{
  return &receiveVars;
}

int receiveNormalVar(char *varStr, int varNum)
{
  // "a/bb/c/"
  int gotNum = 0;
  int gotPos = 0;
  int i = 0;
  printf("Start Receive Vars\n");
  while (1)
  {
    if (gotNum == varNum)
    {
      storeVarNames[gotNum][gotPos] = '\0';
      printf("End Receive Vars\n");
      break;
    }
    if (varStr[i] == '\0')
    {
      printf("Wrong VarNum!\n");
      return 0;
      break;
    }
    if (varStr[i] == '/')
    {
      storeVarNames[gotNum][gotPos] = '\0';
      printf("Received:%s\n", storeVarNames[gotNum]);
      i++;
      gotNum++;
      gotPos = 0;
      continue;
    }

    storeVarNames[gotNum][gotPos] = varStr[i];
    gotPos++;
    i++;
  }

  for (i = 0; i < varNum; i++)
  {
    varList[i].name = storeVarNames[i];
    varList[i].address = &storeVars[i];
  }
  return 1;
}

int compileExpr(char *exprStr)
{
  int err;
  expr = te_compile(exprStr, varList, varTotal, &err);
  if (expr)
  {
    return 1;
  }
  else
  {
    printf("Expr Compile Error :%d.", err);
    return 0;
  }
}

int exprFastScreenBoard(char *exprStr, char *varStr, int varNum)
{
  int rNV = receiveNormalVar(varStr, varNum);
  if (!rNV)
  {
    return 0;
  }

  varList[varNum].name = "l";
  varList[varNum].address = &l_FastScreenBoard;
  varList[varNum + 1].name = "y";
  varList[varNum + 1].address = &y_FastScreenBoard;

  int realNum = varNum + 2;
  varTotal = realNum;

  int cE = compileExpr(exprStr);
  if (!cE)
  {
    return 0;
  }
  else
  {
    return 1;
  }
}

unsigned char (*genFastScreenBoard(int totalWidthmm, int mm2px, int totalWave, int row))[]
{
  int pxnum = totalWidthmm * mm2px;

  int i = 0;
  for (i = 0; i < varTotal - 2; i++)
  {
    storeVars[i] = receiveVars[i];
  }

  int index = 0;

  double x;
  double l;
  // for (i = 0; i < row; i++)
  // {
  for (int j = 0; j < pxnum; j++)
  {
    double rr = 0;
    double rg = 0;
    double rb = 0;

    x = (-(double)(pxnum) / 2.0 + (double)j) / ((double)mm2px);
    y_FastScreenBoard = x;

    for (int k = 0; k < totalWave; k++)
    {
      l = wave[k];
      l_FastScreenBoard = l * 1e-6;
      double instense1 = instense[k];

      double instense2 = te_eval(expr);
      if (checkNANINF(instense2))
      {
        instense2 = 10000;
      }

      double trueInstense = instense1 * instense2;
      unsigned char r, g, b;
      light2rgb(l, &r, &g, &b);
      rr += (double)r * trueInstense;
      rg += (double)g * trueInstense;
      rb += (double)b * trueInstense;
    }
    unsigned char rrr = calcrr(rr, totalWave);
    unsigned char rrg = calcrr(rg, totalWave);
    unsigned char rrb = calcrr(rb, totalWave);

    re[index++] = rrr;
    re[index++] = rrg;
    re[index++] = rrb;
    re[index++] = (unsigned char)255;
  }

  // 复制每一行
  for (i = 1; i < row; i++)
  {
    memcpy(&re[i * pxnum * 4], re, pxnum * 4);
  }
  // }

  return &re;
}

int exprFastScreenBoradUni(char *exprStr, char *varStr, int varNum)
{
  int rNV = receiveNormalVar(varStr, varNum);
  if (!rNV)
  {
    return 0;
  }

  varList[varNum].name = "x";
  varList[varNum].address = &x_FastScreenBoardUni;
  varList[varNum + 1].name = "y";
  varList[varNum + 1].address = &y_FastScreenBoardUni;
  varList[varNum + 2].name = "r";
  varList[varNum + 2].address = &r_FastScreenBoardUni;
  varList[varNum + 3].name = "t";
  varList[varNum + 3].address = &t_FastScreenBoardUni;
  varList[varNum + 4].name = "l";
  varList[varNum + 4].address = &l_FastScreenBoardUni;

  int realNum = varNum + 5;
  varTotal = realNum;

  int cE = compileExpr(exprStr);
  if (!cE)
  {
    return 0;
  }
  else
  {
    return 1;
  }
}

unsigned char (*genFastScreenBoardUni(int totalWidthmm, int totalHeightmm, int mm2px, int totalWave))[]
{
  int pxWidth = totalWidthmm * mm2px;
  int pxHeight = totalHeightmm * mm2px;

  int i = 0;
  for (i = 0; i < varTotal - 2; i++)
  {
    storeVars[i] = receiveVars[i];
  }

  int index = 0;

  double x;
  double y;
  double r;
  double t;
  double l;
  for (i = 0; i < pxHeight; i++)
  {
    y = (-(double)(pxHeight) / 2.0 + (double)i) / ((double)mm2px);
    y_FastScreenBoardUni = y;

    for (int j = 0; j < pxWidth; j++)
    {
      double rr = 0;
      double rg = 0;
      double rb = 0;

      x = (-(double)(pxWidth) / 2.0 + (double)j) / ((double)mm2px);
      x_FastScreenBoardUni = x;

      r = sqrt(x * x + y * y);
      r_FastScreenBoardUni = r;
      t = atan2(y, x);
      t_FastScreenBoardUni = t;

      // printf("x:%f, y:%f, r:%f, t:%f\n", x, y, r, t);

      for (int k = 0; k < totalWave; k++)
      {
        l = wave[k];
        l_FastScreenBoardUni = l * 1e-6;
        double instense1 = instense[k];

        double instense2 = te_eval(expr);
        if (checkNANINF(instense2))
        {
          instense2 = 10000;
        }

        double trueInstense = instense1 * instense2;
        unsigned char r, g, b;
        light2rgb(l, &r, &g, &b);
        // printf("l:%f, instense1:%f, instense2:%f\n", l, instense1, instense2);
        rr += (double)r * trueInstense;
        rg += (double)g * trueInstense;
        rb += (double)b * trueInstense;
      }
      unsigned char rrr = calcrr(rr, totalWave);
      unsigned char rrg = calcrr(rg, totalWave);
      unsigned char rrb = calcrr(rb, totalWave);

      re[index++] = rrr;
      re[index++] = rrg;
      re[index++] = rrb;
      re[index++] = (unsigned char)255;
    }
  }

  return &re;
}
