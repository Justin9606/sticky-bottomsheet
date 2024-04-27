# React Native Sticky Bottom Sheet



https://github.com/Justin9606/sticky-bottomsheet/assets/54047658/c1963993-de45-4cea-be83-f636f916ed69




This project implements a customizable sticky bottom sheet in React Native using `react-native-reanimated` and `react-native-gesture-handler`. The bottom sheet can be dragged up to expand to the full height of the screen or dragged down to collapse.

## Features

- **Draggable Bottom Sheet**: Users can drag the bottom sheet up or down to expand or collapse it.
- **Adaptive Heights**: The bottom sheet adapts to different device heights, including devices with notches.
- **Smooth Animations**: Uses `react-native-reanimated` for smooth and responsive animations.
- **Gesture Handling**: Integrates with `react-native-gesture-handler` for smooth pan gesture recognition.

## Installation

Ensure you have `react-native` installed. Then, clone the project and run:

```bash
yarn install

```

Running the App
To run the app on a device or an emulator, use the following command

For Android:

```bash
yarn android

```
For iOS:

```bash
yarn ios

```

Customization

You can customize the bottom sheet's appearance by editing the BottomSheetWrapper and DragHandler-styled components. Feel free to adjust the colors, borders, and sizes as per your UI/UX design requirements.
