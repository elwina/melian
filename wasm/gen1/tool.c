#include <math.h>

int checkNANINF(double n)
{
  if (isinf(n) || isnan(n))
  {
    return 1;
  }
  return 0;
}
