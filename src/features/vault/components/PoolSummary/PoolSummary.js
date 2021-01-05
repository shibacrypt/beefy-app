import React from 'react';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';

import { formatApy, formatTvl, calcDaily } from 'features/helpers/format';
import { byDecimals } from 'features/helpers/bignumber';
import styles from './styles';
import PoolTitle from './PoolTitle/PoolTitle';
import LabeledStat from './LabeledStat/LabeledStat';
import SummaryActions from './SummaryActions/SummaryActions';

const useStyles = makeStyles(styles);

const PoolSummary = ({ pool, toggleCard, isOpen, balanceSingle, sharesBalance, depositedApy }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <AccordionSummary
      className={pool.depositsPaused ? classes.detailsPaused : classes.details}
      style={{ justifyContent: 'space-between' }}
      onClick={event => {
        event.stopPropagation();
        toggleCard();
      }}
    >
      <Grid
        container
        alignItems="center"
        justify="space-around"
        spacing={1}
        style={{ paddingTop: '16px', paddingBottom: '16px' }}
      >
        <PoolTitle
          name={pool.name}
          logo={pool.logo}
          description={pool.tokenDescription}
          url={pool.tokenDescriptionUrl}
        />
        <Grid item md={7} xs={4}>
          <Grid item container justify="space-between">
            <Hidden xsDown>
              <LabeledStat value={formatDecimals(balanceSingle)} label={t('Vault-Balance')} xs={5} md={3} />
              <LabeledStat
                value={formatDecimals(
                  byDecimals(
                    sharesBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)),
                    pool.tokenDecimals
                  )
                )}
                label={t('Vault-Deposited')}
                xs={5}
                md={3}
                align="start"
              />
              <LabeledStat
                value={pool.unstableApy ? '??? %' : formatApy(depositedApy, pool.defaultApy)}
                label={t('Vault-APY')}
                xs={5}
                md={2}
                align="start"
              />
              <LabeledStat
                value={pool.unstableApy ? '??? %' : calcDaily(depositedApy, pool.defaultApy)}
                label={t('Vault-APYDaily')}
                xs={5}
                md={2}
              />
              <LabeledStat
                value={formatTvl(pool.tvl, pool.oraclePrice, pool.fallbackPrice)}
                label={t('Vault-TVL')}
                xs={5}
                md={2}
              />
            </Hidden>
          </Grid>
        </Grid>
        <SummaryActions
          helpUrl={pool.tokenDescriptionUrl}
          toggleCard={toggleCard}
          isOpen={isOpen}
        />

        <Hidden smUp>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <LabeledStat value={formatDecimals(balanceSingle)} label={t('Vault-Balance')} xs={6} />
            <LabeledStat
              value={formatDecimals(
                byDecimals(
                  sharesBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)),
                  pool.tokenDecimals
                )
              )}
              label={t('Vault-Deposited')}
              xs={6}
              align="start"
            />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <LabeledStat
              value={pool.unstableApy ? '??? %' : formatApy(depositedApy, pool.defaultApy)}
              label={t('Vault-APY')}
              xs={4}
              align="start"
            />
            <LabeledStat
              value={pool.unstableApy ? '??? %' : calcDaily(depositedApy, pool.defaultApy)}
              label={t('Vault-APYDaily')}
              xs={4}
            />
            <LabeledStat
              value={formatTvl(pool.tvl, pool.oraclePrice, pool.fallbackPrice)}
              label={t('Vault-TVL')}
              xs={4}
            />
          </Grid>
        </Hidden>
      </Grid>
    </AccordionSummary>
  );
};

const formatDecimals = (number) => {
  return  (number >= 10) ?
          number.toFixed(4) :  number.isEqualTo(0) ?
          0 : number.toFixed(8)
}

export default PoolSummary;
