package main

import (
	"strconv"
	"strings"
	"syscall/js"

	"engine"

	"github.com/expr-lang/expr"
)

const BUFFER_SIZE int = 1024 * 1024 * 4
const BUFFER_SIZE2 int = 1024 * 1024 * 4

var tempBufferSize int
var tempBuffer [BUFFER_SIZE]uint8
var outBuffer [BUFFER_SIZE2]uint8

//export getTBufferPointer
func getTBufferPointer() *[BUFFER_SIZE]uint8 {
	return &tempBuffer
}

//export setTBufferSize
func setTBufferSize(value int) {
	tempBufferSize = value
}

//export getOBufferPointer
func getOBufferPointer() *[BUFFER_SIZE2]uint8 {
	return &outBuffer
}

//export testInput
func testInput() float64 {
	targetData := tempBuffer[:tempBufferSize]
	msg := &InfFastScreenBoard{}
	if err := msg.UnmarshalVT(targetData); err != nil {
		panic(err)
	}

	for _, v := range msg.GetInstense() {
		return v
	}

	return 0
}

func Log(message string) {
	js.Global().Get("console").Call("log", message)
}

func mathparser(s string) (float64, error) {
	re := 1.0
	var finalError error

	defer func() {
		if r := recover(); r != nil {
			Log("enter panic")
			re = 1.0
			panic(r)
		}
	}()

	re, err := engine.ParseAndExec(s)
	if err != nil {
		finalError = err
	}

	return re, finalError
}

//export geneFastScreenBoard
func geneFastScreenBoard() int {
	targetData := tempBuffer[:tempBufferSize]
	msg := &InfFastScreenBoard{}
	if err := msg.UnmarshalVT(targetData); err != nil {
		panic(err)
	}

	totalWidthmm := int(msg.GetTotalWidthmm())
	mm2px := int(msg.GetMm2Px())
	totalWave := int(msg.GetTotalWave())
	row := int(msg.GetRow())
	ifunc := msg.GetFunc()
	wave := msg.GetWave()
	instense := msg.GetInstense()

	pxNum := totalWidthmm * mm2px

	code := `1+1+2`

	program, err := expr.Compile(code)
	if err != nil {
		panic(err)
	}

	output, err := expr.Run(program, map[string]interface{}{})
	if err != nil {
		panic(err)
	}

	Log(output.(string))

	index := 0
	for i := 0; i < row; i++ {
		for j := 0; j < pxNum; j++ {
			// y := float64(-pxNum/2+j) / float64(mm2px)

			rr := 0.0
			gg := 0.0
			bb := 0.0

			for k := 0; k < totalWave; k++ {
				l := wave[k]
				instense1 := instense[k]
				lstr := strconv.FormatFloat(l*1e-6, 'f', 6, 64)
				// 替换l y
				newfunc := strings.Replace(ifunc, "l", lstr, -1)

				y := float64(-pxNum/2+j) / float64(mm2px)
				ystr := strconv.FormatFloat(y, 'f', 6, 64)
				newfunc = strings.Replace(newfunc, "y", ystr, -1)

				instense2 := 1.0
				instense2, err := mathparser(newfunc)
				if err != nil {
					instense2 = 1
				}
				r, g, b, _ := light2rgb(l)
				rr += float64(r) * instense1 * instense2
				gg += float64(g) * instense1 * instense2
				bb += float64(b) * instense1 * instense2
			}

			rr = rr / float64(totalWave)
			gg = gg / float64(totalWave)
			bb = bb / float64(totalWave)

			outBuffer[index] = uint8(rr)
			index++
			outBuffer[index] = uint8(gg)
			index++
			outBuffer[index] = uint8(bb)
			index++
			outBuffer[index] = 255
			index++
		}
	}
	return row * pxNum * 4
}

func add(this js.Value, args []js.Value) interface{} {
	code := `1+1+2`

	program, err := expr.Compile(code)
	if err != nil {
		panic(err)
	}

	output, err := expr.Run(program, map[string]interface{}{})
	if err != nil {
		panic(err)
	}

	Log(output.(string))

	return output
}

func main() {
	js.Global().Set("goAdd", js.FuncOf(add))
}
