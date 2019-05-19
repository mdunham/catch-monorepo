import React from 'react';
import { Text, View } from 'react-native';
import { Field } from 'redux-form';

import {
  Button,
  styles as st,
  ReduxCheckbox,
  ReduxInput,
  colors,
} from '@catch/rio-ui-kit';

import { HealthDependentCard } from '../components';

const copy = {
  SPOUSE: 'My spouse',
  SELF: 'Myself',
  CHILD: 'My dependent',
};

const DependentsList = ({ fields, viewport }) => (
  <React.Fragment>
    {fields.map((dependent, i) => {
      const field = fields.get(i);
      return (
        <HealthDependentCard
          key={`d-${i}`}
          title={copy[field.relation]}
          viewport={viewport}
          canDelete={field.relation !== 'SELF'}
          onDelete={() => fields.remove(i)}
        >
          {field.relation === 'SELF' ? (
            <Text style={st.get(['H4', 'Regular', 'BottomGutter'], viewport)}>
              {field.age} years old
            </Text>
          ) : (
            <View style={st.get(['Row', 'CenterColumn', 'SmBottomGutter'])}>
              <Field
                name={`${dependent}.age`}
                style={{
                  width: viewport === 'PhoneOnly' ? 64 : 56,
                  fontSize: 18,
                  textAlign: 'center',
                }}
                keyboardType="numeric"
                component={ReduxInput}
                confirmable={false}
                showError={false}
                grouped
              />
              <Text
                style={st.get(
                  ['H4', 'Regular', 'SmLeftGutter', 'SmBottomGutter'],
                  viewport,
                )}
              >
                years old
              </Text>
            </View>
          )}
          {!!field.age &&
            field.age > 12 && (
              <React.Fragment>
                <View style={st.get(['Row', 'SmBottomGutter', 'CenterColumn'])}>
                  <Field
                    name={`${dependent}.isSmoker`}
                    component={ReduxCheckbox}
                    borderColor={colors['ink+2']}
                  />
                  <Text
                    style={st.get(['Body', 'Medium', 'SmLeftGutter'], viewport)}
                  >
                    Tobacco user
                  </Text>
                </View>
                <View style={st.get(['Row', 'SmBottomGutter', 'CenterColumn'])}>
                  <Field
                    name={`${dependent}.isPregnant`}
                    component={ReduxCheckbox}
                    borderColor={colors['ink+2']}
                  />
                  <Text
                    style={st.get(['Body', 'Medium', 'SmLeftGutter'], viewport)}
                  >
                    Pregnant
                  </Text>
                </View>
                <View style={st.get(['Row', 'SmBottomGutter', 'CenterColumn'])}>
                  <Field
                    name={`${dependent}.isParent`}
                    component={ReduxCheckbox}
                    borderColor={colors['ink+2']}
                  />
                  <Text
                    style={st.get(['Body', 'Medium', 'SmLeftGutter'], viewport)}
                  >
                    Parent of a child under 19
                  </Text>
                </View>
              </React.Fragment>
            )}
        </HealthDependentCard>
      );
    })}
    {!fields.getAll().some(dep => dep.relation === 'SPOUSE') && (
      <View style={st.get(['FullWidth', 'ButtonMax', 'BottomGutter'])}>
        <Button
          qaName="Add spouse"
          type="outline"
          viewport={viewport}
          onClick={() => fields.push({ relation: 'SPOUSE', age: '' })}
        >
          Add spouse
        </Button>
      </View>
    )}
    <View style={st.get(['FullWidth', 'ButtonMax', 'XlBottomGutter'])}>
      <Button
        qaName="Add dependent"
        type="outline"
        viewport={viewport}
        onClick={() => fields.push({ relation: 'CHILD', age: '' })}
      >
        Add dependent
      </Button>
    </View>
  </React.Fragment>
);

export default DependentsList;
