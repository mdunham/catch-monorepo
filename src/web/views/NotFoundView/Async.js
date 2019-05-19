import Loadable from 'web/components/Loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "not-found-view" */ './index'),
});
