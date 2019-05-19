import React from 'react';
import PropTypes from 'prop-types';
import { Platform, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { debounce } from 'lodash';
import { Text, SplitLayout, styles, withDimensions } from '@catch/rio-ui-kit';
import { Log } from '@catch/utils';

import { CommonBanks } from '.';
import { AutoSearch } from '../components';
import { Api } from '../store';

export class BankSelect extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    // only send requests for autocomplete every 120ms to avoid load on our servers
    this.searchBanks = debounce(this.searchBanks.bind(this), 120);
  }

  state = { banks: [], error: null, isOpen: false };

  componentDidMount() {
    this.searchBanks({ search: '', limit: 10 });
  }

  searchBanks({ search, limit }) {
    Api.searchBanks({ search, limit })
      .then(banks => {
        this.setState({ banks });
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  selectCommonBrokerage = bankId => {
    const { banks } = this.state;
    const { onSelect } = this.props;
    const bank = banks.find(b => {
      return b && b.id === bankId;
    });
    // TODO - what if brokerage isn't found?
    if (bank) {
      onSelect(bank);
    } else {
      Log.error('Couldnt find bank with id: ' + bankId);
      // onSelect(banks[0]);
    }
  };

  autoselect = name => {
    const { onSelect } = this.props;
    const { banks } = this.state;
    const bank = banks.find(b => {
      return b && b.name === name;
    });
    // TODO - what if brokerage isn't found?
    if (bank) {
      onSelect(bank);
    } else {
      Log.error('Couldnt find bank with name: ' + name);
      // onSelect(banks[0]);
    }
  };

  handleChange = search => {
    const { isOpen } = this.state;
    if (!isOpen && search) {
      this.setState({
        isOpen: true,
      });
    } else if (isOpen && !search) {
      this.setState({
        isOpen: false,
      });
    }
    this.searchBanks({ search, limit: 10 });
  };

  render() {
    const { error, isOpen } = this.state;
    const { children, breakpoints, size } = this.props;

    const topSpace = breakpoints.select({
      PhoneOnly: 'TopGutter',
      default: 'TopSpace',
    });
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'position' })}
        style={styles.get([
          'Container',
          'PageMax',
          'FullSize',
          /* Used to prevent content from showing up above the top bar*/
          { overflow: 'hidden' },
        ])}
      >
        <ScrollView
          contentContainerStyle={styles.get([
            'FullWidth',
            { minHeight: '100%' },
          ])}
        >
          <SplitLayout>
            <View
              style={styles.get(
                [topSpace, 'BottomGutter', 'Margins'],
                breakpoints.current,
              )}
            >
              {children}
              <AutoSearch
                items={this.state.banks.map(b => b.name)}
                onSelect={this.autoselect}
                type="text"
                placeholder="Search banks"
                onInputValueChange={this.handleChange}
              />
            </View>
            {/* @FIXME we hide the banks for now when autocomplete is open
             as the zIndex only works properly with sibling nodes */
            ((Platform.OS === 'ios' && !isOpen) || Platform.OS !== 'ios') && (
              <View
                style={styles.get([topSpace, 'Margins'], breakpoints.current)}
              >
                {!!error && <Text>{error}</Text>}
                <CommonBanks onClick={bank => this.props.onSelect(bank)} />
              </View>
            )}
          </SplitLayout>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const Component = withDimensions(BankSelect);

Component.displayName = 'BankSelect';

export default Component;
