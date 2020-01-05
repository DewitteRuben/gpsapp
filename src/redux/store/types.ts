import MapboxGL from "@react-native-mapbox-gl/maps";
import { IPendingRouteStateAction, IRouteSaveState } from "../actions/routes";

export interface RouteDetail {
  title: string;
  distance: string;
  duration: string;
  method: string;
  start: string;
  end: string;
}

export interface RouteData extends RouteDetail {
  id?: string;
  coordinates: MapboxGL.Coordinates[];
}

interface StoreState {
  settings: SettingsState;
  routes: RouteState;
}

interface SettingsState {
  distanceUnit: string;
  trackingId: string;
}

interface RouteState {
  savedRoutes: RouteData[];
  routeState: IRouteSaveState;
}

export { StoreState, SettingsState, RouteState };
