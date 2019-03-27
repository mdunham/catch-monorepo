import { shadow, borderRadius, animations } from '../const';
import dictionary from './dictionary';
import typography from './typography';
const { grids, increments, colors } = dictionary;

/** ============ Materials ==============
 * Different container textures and elevations help emphasize content
 * and structure space elegantly
 */

const Paper = {
  borderRadius: 6,
  ...shadow.card,
  borderWidth: 1,
  borderColor: colors['ink+3'],
};

const Divider = {
  borderBottomWidth: 1,
  borderBottomColor: colors['sage+1'],
};

const DividerRight = {
  borderRightWidth: 1,
  borderRightColor: colors['sage+1'],
};

const Card = {
  ...Paper,
  backgroundColor: colors.white,
  padding: 24,
};

/** ============= Grids =================
 * Spacing between containers provide a sense of order and consistency
 * across the entire app
 */

/**
 * Margins represent the space between content
 * and the edge of the screen laid out from top to bottom
 * left and right sides equal
 */
const LgMargins = {
  paddingHorizontal: grids['8dp'][3],
};
const SmMargins = {
  paddingHorizontal: grids['8dp'][2],
};
/**
 * Space represents a more arbitrary way to space content
 * using increments or unique distances
 * it is used for example between topBars and headers or content
 * and bottom bars or footers
 */
const LgTopSpace = {
  paddingTop: increments.topBarLarge,
};
const LgBottomSpace = {
  paddingBottom: 72,
};
const SmTopSpace = {
  paddingTop: 24,
};
// TODO
const SmBottomSpace = {
  paddingBottom: 24,
};

const XsTopSpace = {
  paddingTop: 16,
};

const XsBottomSpace = {
  paddingBottom: 16,
};
/**
 * Gutter represents the space between columns
 * it is a way to space out elements withing a layout
 */

const XsRightGutter = {
  marginRight: grids['4dp'][1],
};
const XsLeftGutter = {
  marginLeft: grids['4dp'][1],
};
const XsTopGutter = {
  marginTop: grids['4dp'][1],
};
const XsBottomGutter = {
  marginBottom: grids['4dp'][1],
};

const SmRightGutter = {
  marginRight: grids['8dp'][1],
};
const SmLeftGutter = {
  marginLeft: grids['8dp'][1],
};
const SmTopGutter = {
  marginTop: grids['8dp'][1],
};
const SmBottomGutter = {
  marginBottom: grids['8dp'][1],
};

const RightGutter = {
  marginRight: grids['8dp'][2],
};
const LeftGutter = {
  marginLeft: grids['8dp'][2],
};
const TopGutter = {
  marginTop: grids['8dp'][2],
};
const BottomGutter = {
  marginBottom: grids['8dp'][2],
};

const LgRightGutter = {
  marginRight: grids['8dp'][3],
};
const LgLeftGutter = {
  marginLeft: grids['8dp'][3],
};
const LgTopGutter = {
  marginTop: grids['8dp'][3],
};
const LgBottomGutter = {
  marginBottom: grids['8dp'][3],
};

const XlRightGutter = {
  marginRight: grids['8dp'][4],
};
const XlLeftGutter = {
  marginLeft: grids['8dp'][4],
};
const XlTopGutter = {
  marginTop: grids['8dp'][4],
};
const XlBottomGutter = {
  marginBottom: grids['8dp'][4],
};

/** ========= Content structure ========
 * A set of rules to order content inside containers
 *
 * The core approach of Yoga layout is to determine how to lay out child nodes
 * inside a container node.
 * Both our web root container (<div id="app" style="display:flex;height:100%;">...</div>)
 * and native container fit the entire viewport and will never overflow.
 *
 * We introduce the concept of `fluid` rules. The flex layout system is already
 * technically fluid meaning it can grow or shrink as the viewport change however
 * our concept fluid goes one step beyond and involves changing a flex rule dynamically in order to
 * fit better some viewport sizes.
 * Also had the idea of naming this quantic rules...
 */

/**
 * Flex shorthands
 */
const Flex1 = {
  flex: 1,
};
const Flex2 = {
  flex: 2,
};
const Flex3 = {
  flex: 3,
};
/**
 * Prevent fluid content from filling all of the parent container
 * We can add more breakpoints if needed
 */
const PageMax = {
  maxWidth: increments.pageWidth,
};
const ButtonMax = {
  maxWidth: 280,
};
const ContentMax = {
  maxWidth: 375,
};
const ModalMax = {
  maxWidth: 450,
};
const FormMax = {
  maxWidth: 420,
};
/**
 * Different ways to center content in a full page white frame
 */
const CenterFrameWide = {
  backgroundColor: colors.white,
  alignItems: 'center',
  padding: 40,
  width: '100%',
  maxWidth: 700,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors['ink+3'],
};

/**
 * stacks and aligns children horizontally
 */
const CenterColumn = {
  alignItems: 'center',
  width: '100%',
};
/**
 * stacks and aligns children vertically
 */
const CenterRow = {
  justifyContent: 'center',
  width: '100%',
};
/**
 * Same as above although it only takes half of its parent container
 */
const HalfColumn = {
  alignItems: 'center',
  width: '50%',
};
/**
 * Keeps items centered on the vertical axis
 * and aligned to left.
 * Useful for ordering content horizontally.
 */
const CenterLeftRow = {
  alignItems: 'center',
  flex: 1,
  flexDirection: 'row',
  height: '100%',
};
/**
 * Same as CenterLeftRow but aligns items to the right
 */
const CenterRightRow = {
  alignItems: 'center',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  height: '100%',
};
/**
 * Space row items so they're aligned on each side
 */
const Bilateral = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};
/**
 * Base flex container. We might add additional default rules if needed
 */
const Container = {
  flex: 1,
  width: '100%',
};
/**
 * Row version of the base container
 */
const ContainerRow = {
  ...Container,
  flexDirection: 'row',
};
// Prevents the container to grow
// and take half of the vertical space
const Shrink = {
  flexShrink: 1,
  flexBasis: 'auto',
  flexGrow: 0,
};

/** ============ Floating elements ==========
 * Some elements need to stand out of the layout hierarchy using
 * absolute positioning
 */
/**
 * Core styling for any type of floating bar
 */
const Bar = {
  width: '100%',
  alignItems: 'center',
  left: 0,
  right: 0,
  backgroundColor: colors.white,
};
/**
 * The top app bar provides content and actions related to the current screen.
 * It’s used for branding, screen titles, navigation, and actions.
 * It can transform into a contextual action bar.
 * It is used for the NavBar but you could also spread it in
 * your custom top bar style object and change the height or background color...
 */
const TopBar = {
  ...Bar,
  top: 0,
  borderBottomWidth: 1,
  borderBottomColor: colors['ink+3'],
  zIndex: 100,
};

const BottomBar = {
  ...Bar,
  position: 'absolute',
  flex: 1,
  bottom: 0,
  height: 72,
};
/**
 * I am not sure if there should be a universal spot for a floating
 * control but it could be something like that
 */
const TopLeftControl = {
  position: 'absolute',
  top: grids['8dp'][3],
  left: grids['8dp'][2],
  height: 24,
  width: 24,
  zIndex: 100,
};
const TopRightControl = {
  position: 'absolute',
  top: grids['8dp'][3],
  right: grids['8dp'][2],
  height: 24,
  width: 24,
  zIndex: 100,
};

/** Careful, you're inside an object expression after this point **/
export default {
  /** ============ Materials ========== **/
  White: {
    backgroundColor: colors.white,
  },
  Peach: {
    backgroundColor: colors['peach+2'],
  },
  Gray: {
    backgroundColor: '#EBECEE',
  },
  LightGray: {
    backgroundColor: colors['ink+4'],
  },
  Sage: {
    backgroundColor: colors['sage+2'],
  },
  Paper,
  Divider,
  DividerRight,
  Card,
  Rounded: {
    borderRadius: 6,
  },
  /** ============= Grids ================= **/
  LgMargins,
  SmMargins,
  'Margins/TabletLandscapeUp': LgMargins,
  'Margins/PhoneOnly': SmMargins,
  LgTopSpace,
  SmTopSpace,
  LgBottomSpace,
  SmBottomSpace,
  XsTopSpace,
  XsBottomSpace,
  'TopSpace/TabletLandscapeUp': LgTopSpace,
  'TopSpace/PhoneOnly': SmTopSpace,
  'BottomSpace/TabletLandscapeUp': LgBottomSpace,
  'BottomSpace/PhoneOnly': SmBottomSpace,
  'Spaces/TabletLandscapeUp': {
    ...LgTopSpace,
    ...LgBottomSpace,
  },
  'Spaces/PhoneOnly': {
    ...SmTopSpace,
    ...LgBottomSpace,
  },
  XsTopGutter,
  XsRightGutter,
  XsBottomGutter,
  XsLeftGutter,
  SmTopGutter,
  SmRightGutter,
  SmBottomGutter,
  SmLeftGutter,
  TopGutter,
  RightGutter,
  BottomGutter,
  LeftGutter,
  LgTopGutter,
  LgRightGutter,
  LgBottomGutter,
  LgLeftGutter,
  XlTopGutter,
  XlRightGutter,
  XlBottomGutter,
  XlLeftGutter,
  'FluidSpace/PhoneOnly': {
    paddingHorizontal: 16,
    paddingTop: increments.topBarSmall,
  },
  'FluidSpace/TabletLandscapeUp': {
    paddingHorizontal: 16,
    paddingTop: increments.topBarLarge,
  },
  /**
   * A bit too similar to above, used for the settings screen
   * providing large amount of space in wide display with normal
   * margins in narrow displays
   */
  'Frame/PhoneOnly': {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  'Frame/TabletLandscapeUp': {
    paddingHorizontal: 72,
    paddingVertical: increments.topBarLarge,
    paddingBottom: 24,
  },
  /** ========= Content structure ======== **/
  Flex1,
  Flex2,
  Flex3,
  PageMax,
  ButtonMax,
  ContentMax,
  ModalMax,
  FormMax,
  FullWidth: {
    width: '100%',
  },
  FullHeight: {
    height: '100%',
  },
  FullSize: {
    width: '100%',
    height: '100%',
  },
  'WhiteFrame/PhoneOnly': {
    backgroundColor: colors.white,
    paddingHorizontal: grids['8dp'][2],
    marginTop: grids['8dp'][3],
    width: '100%',
  },
  'WhiteFrame/TabletLandscapeUp': {
    ...Paper,
    backgroundColor: colors.white,
    padding: grids['8dp'][5],
    marginTop: increments.topBarLarge,
    width: 430,
    height: 444,
  },
  'CenterFrameWide/PhoneOnly': {
    ...Container,
    ...SmTopSpace,
    ...SmBottomSpace,
    backgroundColor: colors.white,
  },
  'CenterFrameWide/TabletLandscapeUp': CenterFrameWide,
  CenterRow,
  CenterColumn,
  'CenterColumn/PhoneOnly': {
    ...CenterColumn,
    ...Shrink,
  },
  'CenterColumn/TabletLandscapeUp': {
    ...CenterColumn,
  },
  HalfColumn,
  CenterLeftRow,
  CenterRightRow,
  Bilateral,
  Container,
  ContainerRow,
  Shrink,
  Row: {
    flexDirection: 'row',
  },
  Wrap: {
    flexWrap: 'wrap',
  },
  'FluidContainer/PhoneOnly': {
    ...Container,
  },
  'FluidContainer/TabletLandscapeUp': {
    ...ContainerRow,
  },
  'FluidColumn/PhoneOnly': {
    ...CenterColumn,
  },
  'FluidColumn/TabletLandscapeUp': {
    ...HalfColumn,
  },
  /**
   * Centers content in narrow viewport and left align when wide
   */
  'FluidAlign/PhoneOnly': {
    ...Container,
  },
  'FluidAlign/TabletLandscapeUp': {
    ...CenterColumn,
  },
  /**
   * uses the original PageWrapper padding to stub the spacing when removing it
   */
  'PageWrapper/PhoneOnly': {},
  'PageWrapper/TabletLandscapeUp': {
    ...PageMax,
    paddingVertical: 36,
    paddingHorizontal: 36,
  },
  /** ============ Floating elements ========= **/
  TopLeftControl,
  TopRightControl,
  TopBar,
  'TopBar/TabletLandscapeUp': {
    ...TopBar,
    height: 64,
  },
  'TopBar/PhoneOnly': {
    ...TopBar,
    height: 54,
  },
  BottomBar,
  'BottomBar/PhoneOnly': {
    ...BottomBar,
    borderTopWidth: 1,
    borderTopColor: colors['charcoal--light5'],
  },
  // A non absolute bar for bottom actions
  BottomActions: {
    width: '100%',
    height: 72,
    borderTopWidth: 1,
    borderTopColor: colors['charcoal--light5'],
    flexDirection: 'row',
  },
  /** ============ Typography ========= **/
  ...typography,
  /**
   * Helpers: sometimes the UI library does not cover all edges
   */
  SubtleText: {
    color: colors['ink+1'],
  },
  CenterText: {
    textAlign: 'center',
  },
  RightText: {
    textAlign: 'right',
  },
  SuccessText: {
    color: colors['algae'],
  },
};
