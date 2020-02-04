import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { View } from "react-native";
import { NavigationStackOptions, NavigationStackProp } from "react-navigation-stack";
import { NavigationScreenConfig, NavigationRoute, NavigationParams } from "react-navigation";
import { RenderIconProps } from "react-navigation-material-bottom-tabs/lib/typescript/src/navigators/createMaterialBottomTabNavigator";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { NavigationTabProp } from "react-navigation-material-bottom-tabs";
import { NavigationBottomTabOptions } from "react-navigation-tabs";
import { CText as Text, Icon, WebRTC } from "../../components";
import TrackingMap from "../../components/TrackingMap";
import { GLOBAL } from "../../styles/global";
import { durationToTime, msPerMeterToUnitPerHour } from "../../utils/time";
import { metersToUnit } from "../../utils/units";
import styles from "./styles";

interface NavigationBottomTabScreenComponent {
  navigationOptions?: NavigationScreenConfig<
    NavigationBottomTabOptions,
    NavigationTabProp<NavigationRoute, NavigationParams>,
    unknown
  >;
}

interface Props {
  distanceUnit: string;
  webRTC: boolean;
}

interface NavigationBottomTabScreenFC extends React.FC<Props>, NavigationBottomTabScreenComponent {}

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Map: NavigationBottomTabScreenFC = React.memo(({ distanceUnit, webRTC }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedDistance, setElapsedDistance] = useState(0.0);
  const [distancePerHour, setDistancePerHour] = useState(0.0);
  const [tracking, setTracking] = useState(false);

  const onTimerUpdate = useCallback((duration: number) => {
    setElapsedTime(duration);
  }, []);

  const onRouteUpdate = useCallback((route: MapboxGL.Coordinates[], distance: number) => {
    setElapsedDistance(distance);
  }, []);

  const formattedTime = durationToTime(elapsedTime);

  const formattedDistance = useMemo(() => metersToUnit(elapsedDistance, distanceUnit), [distanceUnit, elapsedDistance]);

  const onTrackToggle = useCallback((t: boolean) => {
    setTracking(t);
  }, []);

  useInterval(() => {
    if (tracking) {
      setDistancePerHour(msPerMeterToUnitPerHour(elapsedDistance, elapsedTime, distanceUnit));
    }
  }, 5000);

  return (
    <View style={GLOBAL.LAYOUT.container}>
      <View style={styles.topBar}>
        <View style={styles.barContainer}>
          <View style={GLOBAL.LAYOUT.alignCenter}>
            <Text variant="h3" white text={formattedDistance} />
            <Text variant="h3" white text={distanceUnit} />
          </View>
        </View>
        <View style={styles.barContainer}>
          <Text variant="h1" white text={formattedTime} />
        </View>
        <View style={styles.barContainer}>
          <View style={GLOBAL.LAYOUT.alignCenter}>
            <Text variant="h3" white text={distancePerHour} />
            <Text variant="h3" white text={`${distanceUnit}/h`} />
          </View>
        </View>
      </View>
      <TrackingMap onTrackToggle={onTrackToggle} onTimerUpdate={onTimerUpdate} onRouteUpdate={onRouteUpdate} />
      {webRTC && <WebRTC />}
    </View>
  );
});

Map.navigationOptions = {
  tabBarIcon: ({ focused }: RenderIconProps) => (
    <Icon type="Foundation" name="map" color={focused ? GLOBAL.MAIN.lighterWhite : GLOBAL.MAIN.green} size={23} />
  )
} as Partial<
  NavigationScreenConfig<NavigationStackOptions, NavigationStackProp<NavigationRoute, NavigationParams>, unknown>
>;

export default Map;
