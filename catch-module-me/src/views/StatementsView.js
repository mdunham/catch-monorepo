import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Text, View, ScrollView } from 'react-native';
import { PageTitle, styles, withDimensions } from '@catch/rio-ui-kit';
import { createLogger } from '@catch/utils';

import { BankStatementRow, BankStatements } from '../containers';
import { EmptyStatement, SettingsLayout } from '../components';

const Log = createLogger('statements-view');

const PREFIX = 'catch.module.me.StatementsView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  // TODO: DELETE from copy sheet
  p2: values => <FormattedMessage id={`${PREFIX}.p2`} values={values} />,
  email: <FormattedMessage id={`${PREFIX}.email`} />,
};

export const StatementsView = ({ breakpoints }) => (
  <SettingsLayout title={COPY['title']} breakpoints={breakpoints}>
    <BankStatements>
      {({ bankStatements, loading }) =>
        loading ? null : bankStatements ? (
          bankStatements.map(statement => (
            <BankStatementRow
              date={statement.date}
              id={statement.id}
              key={statement.id}
            />
          ))
        ) : (
          <Fragment>
            <Text
              style={styles.get(
                ['Body', 'LgBottomGutter', 'ContentMax'],
                breakpoints.current,
              )}
            >
              {COPY['p1']}
            </Text>

            <EmptyStatement />
          </Fragment>
        )
      }
    </BankStatements>
  </SettingsLayout>
);

export default withDimensions(StatementsView);
