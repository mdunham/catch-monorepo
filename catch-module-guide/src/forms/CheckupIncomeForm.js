import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { formValueSelector, submit } from 'redux-form';
import { compose } from 'redux';

import { Button, styles as st } from '@catch/rio-ui-kit';

import { PlanCheckupOptions } from '../components';
import { UserIncomeField, setIncomeFieldName } from '@catch/common';

export const CheckupIncomeForm = ({
  workType,
  viewport,
  onNext,
  onIncomeInfo,
  updateWorkType,
  handleSubmit,
}) => (
  <ScrollView contentContainerStyle={st.get('CenterColumn')}>
    <Text style={st.get(['H3', 'CenterText', 'BottomGutter'], viewport)}>
      Estimated annual income
    </Text>
    <Text
      style={st.get(
        ['CenterText', 'Body', 'XlBottomGutter', 'ButtonMax'],
        viewport,
      )}
    >
      For accurate recommendations, we’ll need a rough estimate of how your
      income breaks down between your types of employment.
    </Text>
    <View style={st.get(['FullWidth', 'ButtonMax', 'XlBottomGutter'])}>
      <UserIncomeField
        form="workTypeCheckup"
        // As we reuse the PlanCheckupOptions workType is an Array
        name={setIncomeFieldName(workType[0])}
        destroyOnUnmount={false}
        labelType={
          workType.includes('WORK_TYPE_DIVERSIFIED') ? 'W2' : undefined
        }
        onInfoClick={() =>
          onIncomeInfo(
            /WORK_TYPE_DIVERSIFIED|WORK_TYPE_W2/.test(workType[0])
              ? 'W2'
              : '1099',
          )
        }
      />
      {workType.includes('WORK_TYPE_DIVERSIFIED') && (
        <UserIncomeField
          form="workTypeCheckup"
          name="estimated1099Income"
          onInfoClick={() => onIncomeInfo('1099')}
          destroyOnUnmount={false}
          labelType="1099"
        />
      )}
    </View>
    <View style={st.get(['FullWidth', 'ButtonMax', 'XlBottomGutter'])}>
      <Button
        wide
        onClick={handleSubmit(values => {
          updateWorkType({
            variables: {
              userIncome: {
                estimated1099Income: values.estimated1099Income,
                estimatedW2Income: values.estimatedW2Income,
              },
              userMetadata: {
                workType: values.workType[0],
              },
            },
          });
          onNext();
        })}
        viewport={viewport}
      >
        Next
      </Button>
    </View>
  </ScrollView>
);

const withFormValues = connect(
  state => ({
    workType: formValueSelector('workTypeCheckup')(state, 'workType'),
  }),
  { submit },
);
const withForm = reduxForm({
  form: 'workTypeCheckup',
  destroyOnUnmount: false,
});

const enhance = compose(
  withFormValues,
  withForm,
);

export default enhance(CheckupIncomeForm);
