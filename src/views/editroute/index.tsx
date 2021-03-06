import { connect } from "react-redux";

import { ThunkDispatch } from "redux-thunk";
import Component from "./Component";
import { StoreState, RouteData } from "../../redux/store/types";
import { localUpdateRoute } from "../../redux/actions/routes";

const getRoutesById = (state: StoreState) => (id: string) =>
  state.routes.savedRoutes.filter(route => route.id === id)[0];

const mapStateToProps = (state: StoreState) => ({
  getRoutesById: getRoutesById(state),
  distanceUnit: state.settings.distanceUnit
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  updateRoute: (routeData: RouteData) => dispatch(localUpdateRoute(routeData))
});

const editRoute = connect(mapStateToProps, mapDispatchToProps)(Component);

export default editRoute;
