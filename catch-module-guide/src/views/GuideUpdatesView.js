import React from 'react';
import PropTypes from 'prop-types';

import { goTo } from '@catch/utils';
import { updateActedOnCache } from '../containers';

import UnpausePlanView from './UnpausePlanView';
import AdjustTaxesView from './AdjustTaxesView';

const updateViews = {
  UnpausePlanView,
  AdjustTaxesView,
};

// View only used in native to render the update views in a different
// nav screen
class GuideUpdatesView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  handleNextUpdate = () => {
    const { updates, updateIndex } = this.props;
    const nextUpdate = updates[updateIndex + 1];
    if (nextUpdate) {
      // Every time we navigate to the next screen we increment
      // the view index so it knows which one to render
      this.goTo('/guide/updates', {
        ...this.props,
        updateIndex: updateIndex + 1,
      });
    } else {
      const { recId } = updates[updateIndex];
      this.props.setIsActedOn({
        variables: {
          input: {
            recommendationID: recId,
            isActedOn: true,
          },
        },
        update: updateActedOnCache(recId),
      });
      this.goTo('/guide', {}, 'RESET');
    }
  };

  render() {
    const {
      updates,
      updateIndex,
      currentRate,
      currentEstimate,
      suggestedRate,
      suggestedEstimate,
    } = this.props;

    const currentUpdate = updates[updateIndex];
    const UpdateView = updateViews[currentUpdate.view];
    return (
      <UpdateView
        planType={currentUpdate.planType}
        onCancel={this.handleNextUpdate}
        onCompleted={this.handleNextUpdate}
        currentRate={currentRate}
        currentEstimate={currentEstimate}
        suggestedRate={suggestedRate}
        suggestedEstimate={suggestedEstimate}
      />
    );
  }
}

export default GuideUpdatesView;
