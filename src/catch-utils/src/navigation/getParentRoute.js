import { Platform } from 'react-native';

/**
 * Time will tell how reliable this is.
 */
export default function getParentRoute() {
  if (Platform.OS === 'web') {
    try {
      // This gives us the full route so to get the parent
      // we need to cut the last child off
      const routes = this.props.match.path.split('/');
      let parentRoute = '';
      routes.forEach((path, i) => {
        if (i !== routes.length - 1 && path.length > 0) {
          parentRoute += '/' + path;
        }
      });
      return parentRoute;
    } catch (e) {
      return '';
    }
  } else {
    try {
      const parentNav = this.props.navigation.dangerouslyGetParent();
      const parentRoute = parentNav.state.routeName;
      return parentRoute;
    } catch (e) {
      return '';
    }
  }
}
