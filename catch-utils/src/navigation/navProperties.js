const ACTIVE_COLOR = '#1F2533';

export const paycheckTabs = id => ({
  root: {
    bottomTabs: {
      children: [
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
              {
                name: 'catchapp/paycheck/intro',
                passProps: { paycheckId: id },
                options: {
                  topBar: {
                    noBorder: true,
                    backButton: {
                      color: ACTIVE_COLOR,
                    },
                  },
                  bottomTabs: {
                    visible: false,
                    drawBehind: true,
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Home.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/guide',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Guide.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/plan',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Plan.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/me',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Profile.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
      ],
      options: {
        bottomTabs: {
          titleDisplayMode: 'alwaysHide',
        },
      },
    },
  },
});

/**
 * Reusable nav properties for complex navigation operations
 */
export const bottomTabs = {
  root: {
    bottomTabs: {
      children: [
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Home.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/guide',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Guide.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/plan',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Plan.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'catchapp/me',
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true,
                    },
                  },
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/Profile.png'),
                // balance icon in iOS
                iconInsets: {
                  top: 5,
                  left: 0,
                  bottom: -5,
                  right: 0,
                },
                selectedIconColor: ACTIVE_COLOR,
              },
            },
          },
        },
      ],
      options: {
        bottomTabs: {
          titleDisplayMode: 'alwaysHide',
        },
      },
    },
  },
};

export const login = {
  root: {
    stack: {
      children: [
        {
          component: {
            name: 'catchapp/auth/sign-in',
            options: {
              topBar: {
                visible: false,
                drawBehind: true,
              },
            },
          },
        },
      ],
    },
  },
};
