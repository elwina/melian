package main

import "math"

func light2rgb(la float64) (uint8, uint8, uint8, uint8) {
	if la > 780 || la < 390 {
		return 0, 0, 0, 255
	}

	newla := int(math.Round(float64(la) * 10))

	rgb := CIE_2015_10_Degree_Standard_Observer[newla]

	return uint8(rgb[0]), uint8(rgb[1]), uint8(rgb[2]), 255
}
