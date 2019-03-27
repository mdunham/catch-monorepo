// Entry point is the navigation
import { Main } from './navigation';
export { registerAuthScreens } from './navigation';
export { withSaga as withAuthSaga } from './store';
export {
  default as authReducer,
  constants as authConstants,
  actions as authActions,
} from './store/duck';
export { default as AutoSignOut } from './containers/AutoSignOut';

export default Main;
