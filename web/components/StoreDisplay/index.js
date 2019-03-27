import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { client } from '@catch/apollo';
import { Env } from '@catch/utils';
import {
  ModalHeader,
  ModalTitle,
  Modal,
  ModalBody,
  Button,
  fonts,
  Box,
  TabPanel,
  Tab,
  Tabs,
  TabList,
  TabPanels,
} from '@catch/rio-ui-kit';

const styles = {
  base: {
    position: 'fixed',
    bottom: 20,
    left: 20,
  },
  code: {
    padding: 10,
    fontSize: fonts.small,
    margin: '0 auto',
    maxWidth: 600,
    overflow: 'auto',
    wordWrap: 'break-word',
  },
};

class StoreDisplay extends Component {
  state = { shown: false };

  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  toggle = () => this.setState({ shown: !this.state.shown });

  render() {
    if (Env.isProdLike) {
      return null;
    }

    return (
      <Box id="debug" style={styles.base}>
        <Button small outline color="subtle" onClick={this.toggle} raised>
          {this.state.shown ? 'Hide' : 'Debug'}
        </Button>

        {this.state.shown && (
          <Modal onRequestClose={this.toggle} width="95%" height="90%">
            <ModalHeader>
              <ModalTitle center>Debug Helper</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Box align="center" justify="center" w={1}>
                <Tabs>
                  <TabList row>
                    <Tab>Redux</Tab>
                    <Tab>Apollo</Tab>
                    <Tab>Local</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Box>
                        <pre style={styles.code}>
                          {JSON.stringify(this.props.store, null, 2)}
                        </pre>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <div style={styles.code}>
                        {JSON.stringify(client.cache.extract())}
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div style={styles.code}>
                        <pre>TODO</pre>
                      </div>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </ModalBody>
          </Modal>
        )}
      </Box>
    );
  }
}

const withConnect = connect(store => ({ store }));

export default withConnect(StoreDisplay);
