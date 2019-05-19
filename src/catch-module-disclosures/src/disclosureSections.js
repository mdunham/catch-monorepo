import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.module.disclosures';

export default [
  {
    title: <FormattedMessage id={`${PREFIX}.platform.title`} />,
    name: <FormattedMessage id={`${PREFIX}.platform.name`} />,
    subtitle: <FormattedMessage id={`${PREFIX}.platform.subtitle`} />,
    documents: [
      {
        title: <FormattedMessage id={`${PREFIX}.platform.terms`} />,
        url: 'terms',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.platform.privacy`} />,
        url: 'privacy-policy',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.platform.esign`} />,
        url: 'communication-transfer',
      },
    ],
  },
  {
    name: <FormattedMessage id={`${PREFIX}.ccm.name`} />,
    subtitle: <FormattedMessage id={`${PREFIX}.ccm.subtitle`} />,
    documents: [
      {
        title: <FormattedMessage id={`${PREFIX}.ccm.agreement`} />,
        url: 'https://s.catch.co/legal/CCM-Investment-Management.pdf',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.ccm.adv2`} />,
        url: 'https://s.catch.co/legal/ccm-adv2a.pdf',
      },
    ],
  },
  {
    title: <FormattedMessage id={`${PREFIX}.bank.title`} />,
    name: <FormattedMessage id={`${PREFIX}.bank.name`} />,
    subtitle: <FormattedMessage id={`${PREFIX}.bank.subtitle`} />,
    documents: [
      {
        title: <FormattedMessage id={`${PREFIX}.bank.terms`} />,
        url: 'bbvac-terms',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.bank.privacy`} />,
        url: 'bbvac-privacy',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.bank.esign`} />,
        url: 'bbvac-electronic',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.bank.opening`} />,
        url: 'bbvac-account-opening',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.bank.deposit`} />,
        url: 'bbvac-deposit-account',
      },
    ],
  },
  {
    title: <FormattedMessage id={`${PREFIX}.brokerage.title`} />,
    name: <FormattedMessage id={`${PREFIX}.brokerage.name`} />,
    subtitle: <FormattedMessage id={`${PREFIX}.brokerage.subtitle`} />,
    documents: [
      {
        title: (
          <FormattedMessage id={`${PREFIX}.brokerage.customer-agreement`} />
        ),
        url: 'https://s.catch.co/legal/folio-account-agreement.pdf',
      },
      {
        title: <FormattedMessage id={`${PREFIX}.brokerage.terms`} />,
        url: 'https://folioclient.com/fcfooter/privacy-policy.jsp',
      },
    ],
  },
];
