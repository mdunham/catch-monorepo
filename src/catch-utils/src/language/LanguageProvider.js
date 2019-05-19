import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { getLocale } from './selectors';
import { createStructuredSelector } from 'reselect';
import { actions } from './duck';
import { SUPPORTED_LOCALES } from './i18n';
import * as Localization from './Localization';

class LanguageProvider extends PureComponent {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  };

  async componentDidMount() {
    const detectedLocale = await Localization.getLocale();
    if (
      typeof detectedLocale === 'string' &&
      SUPPORTED_LOCALES.includes(detectedLocale)
    ) {
      this.props.changeLocale(detectedLocale);
    }
  }

  render() {
    const { locale, messages, children } = this.props;

    return (
      <IntlProvider
        locale={locale}
        key={locale}
        messages={messages[locale]}
        textComponent={Text}
      >
        {Children.only(children)}
      </IntlProvider>
    );
  }
}

export default connect(
  createStructuredSelector({
    locale: getLocale,
  }),
  actions,
)(LanguageProvider);
