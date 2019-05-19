import React from 'react';
import { FormattedMessage } from 'react-intl';
import access from 'safe-access';

// Doctor visits
const PREVENTIVE_CARE = 'Preventive Care/Screening/Immunization';
const PRIMARY_VISIT = 'Primary Care Visit to Treat an Injury or Illness';
const SPECIALIST_VISIT = 'Specialist Visit';
// Prescriptions
const GENERIC_DRUGS = 'Generic Drugs';
const PREFERRED_DRUGS = 'Preferred Brand Drugs';
const NON_PREFERRED_DRUGS = 'Non-Preferred Brand Drugs';
const SPECIALTY_DRUGS = 'Specialty Drugs';
// Vision and dental
const ROUTINE_EYE_ADULT = 'Routine Eye Exam (Adult)';
const ROUTINE_DENTAL_ADULT = 'Routine Dental Services (Adult)';
const BASIC_DENTAL_ADULT = 'Basic Dental Care - Adult';
const MAJOR_DENTAL_ADULT = 'Major Dental Care - Adult';
const ORTHO_ADULT = 'Orthodontia - Adult';
// Children and family planning
const INFERTILITY = 'Infertility Treatment';
const MAJOR_DENTAL_CHILD = 'Major Dental Care - Child';
const ORTHO_CHILD = 'Orthodontia - Child';
const BASIC_DENTAL_CHILD = 'Basic Dental Care - Child';
const ROUTINE_EYE_CHILD = 'Routine Eye Exam for Children';
const GLASSES_CHILD = 'Eye Glasses for Children';
const DENTAL_CHILD = 'Dental Check-Up for Children';
// General treatment and services
const AMBULANCE = 'Emergency Transportation/Ambulance';
const ER_SERVICES = 'Emergency Room Services';
const INPATIENT_MENTAL = 'Mental/Behavioral Health Inpatient Services';
const INPATIENT_HOSPITAL = 'Inpatient Hospital Services (e.g., Hospital Stay)';
const INPATIENT_SURGICAL = 'Inpatient Physician and Surgical Services';
const OUTPATIENT_MENTAL = 'Mental/Behavioral Health Outpatient Services';
const OUTPATIENT_REHAB = 'Outpatient Rehabilitation Services';
const OUTPATIENT_FACILITY =
  'Outpatient Facility Fee (e.g.,  Ambulatory Surgery Center)';
const OUTPATIENT_SURGERY = 'Outpatient Surgery Physician/Surgical Services';
const HABIL_SERVICES = 'Habilitation Services';
const SKILLED_NURSING = 'Skilled Nursing Facility';
const PRIVATE_NURSING = 'Private-Duty Nursing';
// Surgeries and procedures
const HEARING_AIDS = 'Hearing Aids';
const BARIATRIC_SURGERY = 'Bariatric Surgery';
const MED_EQUIPMENT = 'Durable Medical Equipment';
const CHEMO = 'Chemotherapy';
const DIALYSIS = 'Dialysis';
const CHIRO_CARE = 'Chiropractic Care';
const ACUPUNCTURE = 'Acupuncture';
// Lab work
const IMAGING = 'Imaging (CT/PET Scans, MRIs)';
const OUTPATIENT_LAB = 'Laboratory Outpatient and Professional Services';
const XRAYS_DIAGNOSTIC = 'X-rays and Diagnostic Imaging';

const PREFIX = 'catch.health.benefitLabels';

// Map the api names
const copy = {
  // Doctor visits
  [PREVENTIVE_CARE]: <FormattedMessage id={`${PREFIX}.PREVENTIVE_CARE`} />,
  [PRIMARY_VISIT]: <FormattedMessage id={`${PREFIX}.PRIMARY_VISIT`} />,
  [SPECIALIST_VISIT]: <FormattedMessage id={`${PREFIX}.SPECIALIST_VISIT`} />,
  // Prescriptions
  [GENERIC_DRUGS]: <FormattedMessage id={`${PREFIX}.GENERIC_DRUGS`} />,
  [PREFERRED_DRUGS]: <FormattedMessage id={`${PREFIX}.PREFERRED_DRUGS`} />,
  [NON_PREFERRED_DRUGS]: (
    <FormattedMessage id={`${PREFIX}.NON_PREFERRED_DRUGS`} />
  ),
  [SPECIALTY_DRUGS]: <FormattedMessage id={`${PREFIX}.SPECIALTY_DRUGS`} />,
  // Vision and dental
  [ROUTINE_EYE_ADULT]: <FormattedMessage id={`${PREFIX}.ROUTINE_EYE_ADULT`} />,
  [ROUTINE_DENTAL_ADULT]: (
    <FormattedMessage id={`${PREFIX}.ROUTINE_DENTAL_ADULT`} />
  ),
  [BASIC_DENTAL_ADULT]: (
    <FormattedMessage id={`${PREFIX}.BASIC_DENTAL_ADULT`} />
  ),
  [MAJOR_DENTAL_ADULT]: (
    <FormattedMessage id={`${PREFIX}.MAJOR_DENTAL_ADULT`} />
  ),
  [ORTHO_ADULT]: <FormattedMessage id={`${PREFIX}.ORTHO_ADULT`} />,
  // Children and family planning
  [INFERTILITY]: <FormattedMessage id={`${PREFIX}.INFERTILITY`} />,
  [MAJOR_DENTAL_CHILD]: (
    <FormattedMessage id={`${PREFIX}.MAJOR_DENTAL_CHILD`} />
  ),
  [ORTHO_CHILD]: <FormattedMessage id={`${PREFIX}.ORTHO_CHILD`} />,
  [BASIC_DENTAL_CHILD]: (
    <FormattedMessage id={`${PREFIX}.BASIC_DENTAL_CHILD`} />
  ),
  [ROUTINE_EYE_CHILD]: <FormattedMessage id={`${PREFIX}.ROUTINE_EYE_CHILD`} />,
  [GLASSES_CHILD]: <FormattedMessage id={`${PREFIX}.GLASSES_CHILD`} />,
  [DENTAL_CHILD]: <FormattedMessage id={`${PREFIX}.DENTAL_CHILD`} />,
  // General treatment and services
  [AMBULANCE]: <FormattedMessage id={`${PREFIX}.AMBULANCE`} />,
  [ER_SERVICES]: <FormattedMessage id={`${PREFIX}.ER_SERVICES`} />,
  [INPATIENT_MENTAL]: <FormattedMessage id={`${PREFIX}.INPATIENT_MENTAL`} />,
  [INPATIENT_HOSPITAL]: (
    <FormattedMessage id={`${PREFIX}.INPATIENT_HOSPITAL`} />
  ),
  [INPATIENT_SURGICAL]: (
    <FormattedMessage id={`${PREFIX}.INPATIENT_SURGICAL`} />
  ),
  [OUTPATIENT_MENTAL]: <FormattedMessage id={`${PREFIX}.OUTPATIENT_MENTAL`} />,
  [OUTPATIENT_REHAB]: <FormattedMessage id={`${PREFIX}.OUTPATIENT_REHAB`} />,
  [OUTPATIENT_FACILITY]: (
    <FormattedMessage id={`${PREFIX}.OUTPATIENT_FACILITY`} />
  ),
  [OUTPATIENT_SURGERY]: (
    <FormattedMessage id={`${PREFIX}.OUTPATIENT_SURGERY`} />
  ),
  [HABIL_SERVICES]: <FormattedMessage id={`${PREFIX}.HABIL_SERVICES`} />,
  [SKILLED_NURSING]: <FormattedMessage id={`${PREFIX}.SKILLED_NURSING`} />,
  [PRIVATE_NURSING]: <FormattedMessage id={`${PREFIX}.PRIVATE_NURSING`} />,
  // Surgeries and procedures
  [HEARING_AIDS]: <FormattedMessage id={`${PREFIX}.HEARING_AIDS`} />,
  [BARIATRIC_SURGERY]: <FormattedMessage id={`${PREFIX}.BARIATRIC_SURGERY`} />,
  [MED_EQUIPMENT]: <FormattedMessage id={`${PREFIX}.MED_EQUIPMENT`} />,
  [CHEMO]: <FormattedMessage id={`${PREFIX}.CHEMO`} />,
  [DIALYSIS]: <FormattedMessage id={`${PREFIX}.DIALYSIS`} />,
  [CHIRO_CARE]: <FormattedMessage id={`${PREFIX}.CHIRO_CARE`} />,
  [ACUPUNCTURE]: <FormattedMessage id={`${PREFIX}.ACUPUNCTURE`} />,
  // Lab work
  [IMAGING]: <FormattedMessage id={`${PREFIX}.IMAGING`} />,
  [OUTPATIENT_LAB]: <FormattedMessage id={`${PREFIX}.OUTPATIENT_LAB`} />,
  [XRAYS_DIAGNOSTIC]: <FormattedMessage id={`${PREFIX}.XRAYS_DIAGNOSTIC`} />,
  // Free care, include by default as not provided by the api
  VACCINATION: <FormattedMessage id={`${PREFIX}.VACCINATION`} />,
  STI: <FormattedMessage id={`${PREFIX}.STI`} />,
  HIV: <FormattedMessage id={`${PREFIX}.HIV`} />,
  BLOOD_PRESSURE: <FormattedMessage id={`${PREFIX}.BLOOD_PRESSURE`} />,
  CONTRACEPTION: <FormattedMessage id={`${PREFIX}.CONTRACEPTION`} />,
  CER_CANCER_SCREEN: <FormattedMessage id={`${PREFIX}.CER_CANCER_SCREEN`} />,
  BRE_CANCER_SCREEN: <FormattedMessage id={`${PREFIX}.BRE_CANCER_SCREEN`} />,
  ALCOHOL_SCREEN: <FormattedMessage id={`${PREFIX}.ALCOHOL_SCREEN`} />,
  TOBACCO_SCREEN: <FormattedMessage id={`${PREFIX}.TOBACCO_SCREEN`} />,
  CHILD_BEHAVIOR: <FormattedMessage id={`${PREFIX}.CHILD_BEHAVIOR`} />,
  CHILD_DEVELOP: <FormattedMessage id={`${PREFIX}.CHILD_DEVELOP`} />,
};

const freeCareDefaults = [
  copy['VACCINATION'],
  copy['STI'],
  copy['HIV'],
  copy['BLOOD_PRESSURE'],
  copy['CONTRACEPTION'],
  copy['CER_CANCER_SCREEN'],
  copy['BRE_CANCER_SCREEN'],
  copy['ALCOHOL_SCREEN'],
  copy['TOBACCO_SCREEN'],
];
const familyDefaults = [
  copy['CONTRACEPTION'],
  copy['STI'],
  copy['HIV'],
  copy['VACCINATION'],
  copy['CHILD_BEHAVIOR'],
  copy['CHILD_DEVELOP'],
];

function formatBenefit(item, category) {
  if (/deductible|Deductible/.test(item.value)) {
    category[1] = [
      ...category[1],
      {
        label: item.label,
        value: 'Full cost',
      },
    ];
    if (/Coinsurance/.test(item.value)) {
      category[2] = [
        ...category[2],
        {
          label: item.label,
          value: `${item.value.split(' ')[0]} cost`,
        },
      ];
    } else if (/Copay/.test(item.value)) {
      category[2] = [
        ...category[2],
        {
          label: item.label,
          value: item.value.split(' ')[0],
        },
      ];
    } else if (/No Charge/.test(item.value)) {
      category[2] = [
        ...category[2],
        {
          label: item.label,
          value: 'Free',
        },
      ];
    } else {
      category[2] = [...category[2], item];
    }
  } else if (item.value == 'No Charge') {
    category[0] = [
      ...category[0],
      {
        label: item.label,
        value: 'Free',
      },
    ];
  } else {
    category[0] = [...category[0], item];
  }
}

/**
 * Benefit categories
 * Each benefit category has 3 sub categories:
 * [0] Pre deductible
 * [1] Post deductible
 * [2] Free
 */
export function sortBenefits(benefits) {
  const doctorVisits = [[], [], []];
  const prescriptions = [[], [], []];
  const visionAndDental = [[], [], []];
  const familyPlanning = [
    familyDefaults.map(label => ({
      label,
      value: 'Free',
    })),
    [],
    [],
  ];
  const generalServices = [[], [], []];
  const surgeries = [[], [], []];
  const labWork = [[], [], []];
  const freeCare = [
    freeCareDefaults.map(label => ({
      label,
      value: 'Free',
    })),
    [],
    [],
  ];
  benefits.forEach(ben => {
    const payload = {
      label: copy[ben.name],
      value: ben.covered
        ? access(ben, 'costSharings[0].displayString')
        : 'Not covered',
    };
    switch (ben.name) {
      case PREVENTIVE_CARE:
      case PRIMARY_VISIT:
      case SPECIALIST_VISIT:
        formatBenefit(payload, doctorVisits);
        break;
      case GENERIC_DRUGS:
      case PREFERRED_DRUGS:
      case NON_PREFERRED_DRUGS:
      case SPECIALTY_DRUGS:
        formatBenefit(payload, prescriptions);
        break;
      case ROUTINE_EYE_ADULT:
      case ROUTINE_DENTAL_ADULT:
      case BASIC_DENTAL_ADULT:
      case MAJOR_DENTAL_ADULT:
      case ORTHO_ADULT:
        formatBenefit(payload, visionAndDental);
        break;
      case INFERTILITY:
      case MAJOR_DENTAL_CHILD:
      case ORTHO_CHILD:
      case BASIC_DENTAL_CHILD:
      case ROUTINE_EYE_CHILD:
      case GLASSES_CHILD:
      case DENTAL_CHILD:
        formatBenefit(payload, familyPlanning);
        break;
      case AMBULANCE:
      case ER_SERVICES:
      case INPATIENT_MENTAL:
      case INPATIENT_HOSPITAL:
      case INPATIENT_SURGICAL:
      case OUTPATIENT_MENTAL:
      case OUTPATIENT_REHAB:
      case OUTPATIENT_FACILITY:
      case OUTPATIENT_SURGERY:
      case HABIL_SERVICES:
      case SKILLED_NURSING:
      case PRIVATE_NURSING:
        formatBenefit(payload, generalServices);
        break;
      case HEARING_AIDS:
      case BARIATRIC_SURGERY:
      case MED_EQUIPMENT:
      case CHEMO:
      case DIALYSIS:
      case CHIRO_CARE:
      case ACUPUNCTURE:
        formatBenefit(payload, surgeries);
        break;
      case IMAGING:
      case OUTPATIENT_LAB:
      case XRAYS_DIAGNOSTIC:
        formatBenefit(payload, labWork);
        break;
    }
  });

  return {
    doctorVisits,
    prescriptions,
    visionAndDental,
    familyPlanning,
    generalServices,
    surgeries,
    labWork,
    freeCare,
  };
}
