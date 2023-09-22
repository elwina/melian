# Melian 波动光学演示系统

```
melian
├─ .auto
│  └─ version.js
├─ .gitignore
├─ assets
│  ├─ assets.d.ts
│  ├─ back1.jpg
│  ├─ des
│  │  ├─ fresnel_hole1.png
│  │  ├─ fresnel_hole2.png
│  │  ├─ fresnel_hole3.png
│  │  ├─ fresnel_hole4.png
│  │  ├─ opticalgrating1.png
│  │  ├─ opticalgrating2.png
│  │  ├─ opticalgrating3.png
│  │  ├─ polarization1.png
│  │  ├─ polarization2.png
│  │  ├─ polarization3.png
│  │  ├─ polarization4.png
│  │  ├─ singlesilt1.png
│  │  ├─ singlesilt2.png
│  │  ├─ singlesilt3.png
│  │  ├─ singlesilt4.png
│  │  ├─ young1.png
│  │  ├─ young2.png
│  │  └─ young3.png
│  ├─ entitlements.mac.plist
│  ├─ icon.ico
│  ├─ icon.png
│  ├─ icon.svg
│  ├─ lens
│  │  ├─ bead01.svg
│  │  ├─ board01.svg
│  │  ├─ convex_lens01.svg
│  │  ├─ crystal01.svg
│  │  ├─ double_slit01.svg
│  │  ├─ holes01.svg
│  │  ├─ laser01.svg
│  │  ├─ light01.svg
│  │  ├─ measure_lens01.svg
│  │  ├─ measure_lens02.svg
│  │  ├─ needle01.svg
│  │  ├─ polarizer01.svg
│  │  ├─ raster01.svg
│  │  └─ single_slit01.svg
│  └─ settings
│     ├─ CircleS.svg
│     └─ CircleS2.png
├─ package-lock.json
├─ package.json
├─ README.md
├─ release
│  └─ app
│     ├─ package-lock.json
│     └─ package.json
├─ src
│  ├─ main
│  │  ├─ main.ts
│  │  ├─ menu.ts
│  │  ├─ preload.ts
│  │  └─ util.ts
│  ├─ renderer
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ color
│  │  │  ├─ CIE_2015_10_Degree_Standard_Observer.ts
│  │  │  ├─ light2rgb2.ts
│  │  │  ├─ light2rgb_old.ts
│  │  │  ├─ lightwave.ts
│  │  │  └─ spectrum.ts
│  │  ├─ experiment
│  │  │  ├─ default.ts
│  │  │  ├─ json
│  │  │  │  ├─ fresnel_hole.melian.json
│  │  │  │  ├─ opticalgrating.melian.json
│  │  │  │  ├─ polarization.melian.json
│  │  │  │  ├─ singlesilt.melian.json
│  │  │  │  └─ young.melian.json
│  │  │  └─ switchExp.tsx
│  │  ├─ front
│  │  │  ├─ Frontpage.tsx
│  │  │  ├─ getImg.tsx
│  │  │  └─ ImagePPT.tsx
│  │  ├─ index.ejs
│  │  ├─ index.tsx
│  │  ├─ lab
│  │  │  ├─ Ctrl.tsx
│  │  │  ├─ DragMove.tsx
│  │  │  ├─ Holder.tsx
│  │  │  ├─ Len.tsx
│  │  │  ├─ LenGene.tsx
│  │  │  ├─ lensConfig.tsx
│  │  │  └─ Scene.tsx
│  │  ├─ measures
│  │  │  ├─ Circle.tsx
│  │  │  ├─ mReg.tsx
│  │  │  └─ Square.tsx
│  │  ├─ preload.d.ts
│  │  ├─ react.d.ts
│  │  ├─ screens
│  │  │  ├─ ScreenBoard.tsx
│  │  │  ├─ ScreenBoardPolar.tsx
│  │  │  ├─ ScreenFixedCircle.tsx
│  │  │  ├─ ScreenFixedCirclePolar.tsx
│  │  │  └─ sReg.tsx
│  │  ├─ setting
│  │  │  ├─ ButtonSelect.tsx
│  │  │  ├─ ButtonSlider.tsx
│  │  │  ├─ CircleSlider.tsx
│  │  │  ├─ EasyAction.tsx
│  │  │  ├─ FourSide.tsx
│  │  │  ├─ LoadSetting.tsx
│  │  │  ├─ StyleAdjust.tsx
│  │  │  └─ TwoArrow.tsx
│  │  ├─ typing
│  │  │  ├─ config.type.ts
│  │  │  ├─ measure.type.ts
│  │  │  └─ screen.type.ts
│  │  ├─ utils
│  │  │  ├─ array.ts
│  │  │  ├─ autoResize.ts
│  │  │  ├─ common.ts
│  │  │  ├─ number.ts
│  │  │  ├─ parseRequire.ts
│  │  │  └─ type.ts
│  │  └─ welcome
│  │     ├─ Welcome.css
│  │     └─ Welcome.tsx
│  └─ __tests__
│     └─ App.test.tsx
└─ tsconfig.json

```
