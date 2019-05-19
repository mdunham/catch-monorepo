import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { arrayRemove, formValueSelector } from 'redux-form';

import { goTo } from '@catch/utils';
import { withDimensions } from '@catch/rio-ui-kit';
import { HealthDependentsForm } from '../forms';
import {
  HealthDependents,
  SaveHealthDependents,
  SaveExitStage,
} from '../containers';
import { MedicareMessage } from '../components';

/**
 * @enum { string } medicareStatus
 * SELF
 * SELF_AND_SPOUSE
 * FAMILY
 * SPOUSE
 * DEPENDENT
 */
export function getMedicareStatus(people) {
  let medicareStatus;
  people.forEach(peop => {
    if (peop.age > 64) {
      switch (peop.relation) {
        case 'SELF':
          medicareStatus = 'SELF';
          break;
        case 'SPOUSE':
          if (medicareStatus === 'SELF') {
            medicareStatus = 'SELF_AND_SPOUSE';
          } else if (!medicareStatus) {
            medicareStatus = 'SPOUSE';
          } else {
            medicareStatus = 'FAMILY';
          }
          break;
        case 'OTHER_DEPENDENT':
          if (
            medicareStatus === 'SELF' ||
            medicareStatus === 'SELF_AND_SPOUSE'
          ) {
            medicareStatus = 'FAMILY';
          } else {
            medicareStatus = 'DEPENDENT';
          }
      }
    }
  });
  return medicareStatus;
}

export class HealthDependentsView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.state = {
      medicareStatus: null,
      isExiting: false,
    };
  }
  handleExit = () => {
    this.setState({
      isExiting: true,
    });
    // Save the form value before exiting
    this.form.submit();
  };
  warnBeforeSubmit = data => {
    if (!this.state.medicareStatus) {
      const medicareStatus = getMedicareStatus(data.dependents);
      if (medicareStatus) {
        this.setState({ medicareStatus });
        return true;
      }
    }
    return false;
  };
  handleClose = () => {
    this.setState({
      medicareStatus: null,
    });
  };
  handleRemove = () => {
    const { medicareStatus } = this.state;
    const { dependents, removeDependent } = this.props;

    dependents.forEach((dep, i) => {
      if (medicareStatus === 'SPOUSE' && dep.relation === 'SPOUSE') {
        removeDependent('healthDependentsForm', 'dependents', i);
      }
      if (
        medicareStatus === 'DEPENDENT' &&
        dep.relation === 'OTHER_DEPENDENT'
      ) {
        removeDependent('healthDependentsForm', 'dependents', i);
      }
    });
    this.form.submit();
  };
  handleSave = cb => {
    return async data => {
      if (!this.warnBeforeSubmit(data)) {
        const payload = {
          variables: {
            input: data.dependents.map(dep => ({
              ...dep,
              // Make sure age is a number
              age: Number(dep.age),
              // remove the age limit on dependents,
              // and default dependents to children unless they're 26 or older
              relation:
                dep.relation === 'CHILD' && Number(dep.age) > 25
                  ? 'OTHER_RELATIVE'
                  : dep.relation,
            })),
          },
        };
        await cb(payload);
        if (this.state.isExiting) {
          this.goTo('/plan/health/exit');
        } else {
          this.goTo('/plan/health/income');
        }
      }
    };
  };
  handleContinue = () => {
    this.form.submit();
  };
  render() {
    const { viewport } = this.props;
    const { medicareStatus } = this.state;
    return (
      <React.Fragment>
        <HealthDependents>
          {({ loading, dependents, age }) => (
            <SaveHealthDependents>
              {({ loading: saving, saveHealthDependents }) => (
                <HealthDependentsForm
                  initialValues={{
                    dependents: dependents.length
                      ? dependents.map(dep => ({
                          ...dep,
                          age: `${dep.age}`,
                        }))
                      : [{ relation: 'SELF', age: age || 0 }],
                  }}
                  loading={saving}
                  onSubmit={this.handleSave(saveHealthDependents)}
                  viewport={viewport}
                  ref={el => (this.form = el)}
                />
              )}
            </SaveHealthDependents>
          )}
        </HealthDependents>
        {medicareStatus && (
          <SaveExitStage stage="MEDICARE" onCompleted={this.handleExit}>
            {({ saveExitStage }) => (
              <MedicareMessage
                viewport={viewport}
                onExit={saveExitStage}
                status={medicareStatus}
                onClose={this.handleClose}
                onRemove={this.handleRemove}
                onContinue={this.handleContinue}
              />
            )}
          </SaveExitStage>
        )}
      </React.Fragment>
    );
  }
}

const withRedux = connect(
  state => ({
    dependents: formValueSelector('healthDependentsForm')(state, 'dependents'),
  }),
  { removeDependent: arrayRemove },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

export default enhance(HealthDependentsView);
