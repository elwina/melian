package engine

import (
	"errors"
	"math"
)

const (
	RadianMode = iota
	AngleMode
)

type defS struct {
	argc int
	fun  func(expr ...ExprAST) float64
}

// enum "RadianMode", "AngleMode"
var TrigonometricMode = RadianMode

var defConst = map[string]float64{
	"pi": math.Pi,
}

var defFunc map[string]defS

func init() {
	defFunc = map[string]defS{
		"sin": {1, defSin},
		"cos": {1, defCos},
		"tan": {1, defTan},
		"cot": {1, defCot},
		"sec": {1, defSec},
		"csc": {1, defCsc},

		"abs":   {1, defAbs},
		"ceil":  {1, defCeil},
		"floor": {1, defFloor},
		"round": {1, defRound},
		"sqrt":  {1, defSqrt},
		"cbrt":  {1, defCbrt},

		"noerr": {1, defNoerr},

		"max": {-1, defMax},
		"min": {-1, defMin},
	}
}

// sin(pi/2) = 1
func defSin(expr ...ExprAST) float64 {
	return math.Sin(expr2Radian(expr[0]))
}

// cos(0) = 1
func defCos(expr ...ExprAST) float64 {
	return math.Cos(expr2Radian(expr[0]))
}

// tan(pi/4) = 1
func defTan(expr ...ExprAST) float64 {
	return math.Tan(expr2Radian(expr[0]))
}

// cot(pi/4) = 1
func defCot(expr ...ExprAST) float64 {
	return 1 / defTan(expr...)
}

// sec(0) = 1
func defSec(expr ...ExprAST) float64 {
	return 1 / defCos(expr...)
}

// csc(pi/2) = 1
func defCsc(expr ...ExprAST) float64 {
	return 1 / defSin(expr...)
}

// abs(-2) = 2
func defAbs(expr ...ExprAST) float64 {
	v, _ := ExprASTResult(expr[0])
	return math.Abs(v)
}

// ceil(4.2) = ceil(4.8) = 5
func defCeil(expr ...ExprAST) float64 {
	v, _ := ExprASTResult(expr[0])
	return math.Ceil(v)
}

// floor(4.2) = floor(4.8) = 4
func defFloor(expr ...ExprAST) float64 {
	v, _ := ExprASTResult(expr[0])
	return math.Floor(v)
}

// round(4.2) = 4
// round(4.6) = 5
func defRound(expr ...ExprAST) float64 {
	v, _ := ExprASTResult(expr[0])
	return math.Round(v)
}

// sqrt(4) = 2
// sqrt(4) = abs(sqrt(4))
// returns only the absolute value of the result
func defSqrt(expr ...ExprAST) float64 {
	v, _ := ExprASTResult(expr[0])
	return math.Sqrt(v)
}

// cbrt(27) = 3
func defCbrt(expr ...ExprAST) float64 {
	v, _ := ExprASTResult(expr[0])
	return math.Cbrt(v)
}

// max(2) = 2
// max(2, 3) = 3
// max(2, 3, 1) = 3
func defMax(expr ...ExprAST) float64 {
	if len(expr) == 0 {
		panic(errors.New("calling function `max` must have at least one parameter."))
	}
	if len(expr) == 1 {
		v, _ := ExprASTResult(expr[0])
		return v
	}
	maxV, _ := ExprASTResult(expr[0])
	for i := 1; i < len(expr); i++ {
		v, _ := ExprASTResult(expr[i])
		maxV = math.Max(maxV, v)
	}
	return maxV
}

// min(2) = 2
// min(2, 3) = 2
// min(2, 3, 1) = 1
func defMin(expr ...ExprAST) float64 {
	if len(expr) == 0 {
		panic(errors.New("calling function `min` must have at least one parameter."))
	}
	if len(expr) == 1 {
		v, _ := ExprASTResult(expr[0])
		return v
	}
	maxV, _ := ExprASTResult(expr[0])
	for i := 1; i < len(expr); i++ {
		v, _ := ExprASTResult(expr[i])
		maxV = math.Min(maxV, v)
	}
	return maxV
}

// noerr(1/0) = 0
// noerr(2.5/(1-1)) = 0
func defNoerr(expr ...ExprAST) (r float64) {
	defer func() {
		if e := recover(); e != nil {
			r = 0
		}
	}()
	r, _ = ExprASTResult(expr[0])
	return r
}
