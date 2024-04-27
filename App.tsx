/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Platform,
  StatusBar,
  View,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
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
// Retrieve the height of the device's status bar
const statusBarHeight = StatusBar.currentHeight || 0;
// Determine if the iOS device has a notch (this affects the layout and height calculations)
const hasNotch =
  Platform.OS === 'ios' && (screenHeight >= 812 || screenHeight >= 896);

// Calculate the header's height, considering the notch and the status bar
const getHeaderHeight = (headerHeight: number): number => {
  if (Platform.OS === 'ios') {
    // Additional padding is added for iOS devices with a notch
    return hasNotch ? headerHeight + 30 : headerHeight;
  } else {
    // For Android, subtract the status bar height from the header height and add a constant
    return headerHeight - statusBarHeight + 35;
  }
};

const App = () => {
  // A shared value for the Y-axis translation of the bottom sheet (controls the vertical position)
  const translateY = useSharedValue(screenHeight - 150); // The bottom sheet's initial position

  // Static value for the header height, you might want to make this dynamic depending on your app
  const headerHeight = 50;
  // Calculate the maximum expanded height for the bottom sheet (full screen height minus the header height)
  const expandedHeight = getHeaderHeight(headerHeight);

  // Gesture handler for the bottom sheet's pan (drag) gesture
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      // Capture the starting position of the bottom sheet at the start of the gesture
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Calculate the new position of the bottom sheet as the user drags it
      const newPosition = ctx.startY + event.translationY;
      // Ensure the new position is within the allowed range (expandedHeight to screenHeight - 150)
      translateY.value =
        newPosition >= expandedHeight && newPosition <= screenHeight - 150
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
        translateY.value = withTiming(expandedHeight, {
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
    // Root view for handling gestures; necessary for `react-native-gesture-handler`
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#eaebed'}}>
        {/* PanGestureHandler to capture drag (pan) gestures */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          {/* Animated view for the bottom sheet that will move up and down */}
          <BottomSheetWrapper style={animatedStyle}>
            {/* Draggable indicator area */}
            <DragHandler />
            {/* Scrollable content area */}
            <ScrollView
              scrollEventThrottle={16} // Set the rate of firing scroll events
              style={{maxHeight: '100%'}}>
              {/* Content within the bottom sheet */}
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
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
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
  background-color: #eaebed;
  border-radius: 2.5px;
  margin: 12px auto;
`;

export default App;
