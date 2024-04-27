/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Dimensions, Text} from 'react-native';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

// Retrieve the full height of the device's screen
const screenHeight = Dimensions.get('window').height;

// Calculate the header's height, considering the notch and the status bar

const App = () => {
  // A shared value for the Y-axis translation of the bottom sheet (controls the vertical position)
  const translateY = useSharedValue(screenHeight - 200); // The bottom sheet's initial position

  // Use a static number for the expanded height (100 pixels from the top)
  const staticExpandedHeight = 100; // This is your  static number for expanded height

  // Gesture handler for the bottom sheet's pan (drag) gesture
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      // Capture the starting position of the bottom sheet at the start of the gesture
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Calculate the new position of the bottom sheet as the user drags it
      const newPosition = ctx.startY + event.translationY;
      // Ensure the new position is within the allowed range (staticExpandedHeight to screenHeight - 150)
      translateY.value =
        newPosition >= staticExpandedHeight && newPosition <= screenHeight - 150
          ? newPosition
          : translateY.value;
    },
    onEnd: () => {
      // When the user releases the bottom sheet, decide where it should snap to
      if (translateY.value > screenHeight / 2) {
        // If the bottom sheet is released in the lower half of the screen, collapse it
        translateY.value = withTiming(screenHeight - 150, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      } else {
        // If the bottom sheet is released in the upper half of the screen, expand it
        translateY.value = withTiming(staticExpandedHeight, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
    },
  });

  // Animated style that will be applied to the bottom sheet container
  // It uses the translateY shared value to move the bottom sheet up and down
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <BottomSheetWrapper style={animatedStyle}>
            <DragHandler />
            <ScrollView scrollEventThrottle={16} style={{maxHeight: '100%'}}>
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text>Sticky Bottom Sheet Content</Text>
              </View>
            </ScrollView>
          </BottomSheetWrapper>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const BottomSheetWrapper = styled(Animated.View)`
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: white;
`;

const DragHandler = styled.View`
  width: 40px;
  height: 5px;
  background-color: gray;
  border-radius: 2.5px;
  margin: 12px auto;
`;

export default App;
