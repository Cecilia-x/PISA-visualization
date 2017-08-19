import pandas
import numpy
import statsmodels.formula.api as sm

cols = ['CNT', 'SUBNATIO', 'STRATUM', 'OECD', 'NC', 'SCHOOLID', 'STIDSTD', 'ESCS', 'W_FSTUWT',
        'PV1MATH', 'PV2MATH', 'PV3MATH', 'PV4MATH', 'PV5MATH', 
        'PV1READ', 'PV2READ', 'PV3READ', 'PV4READ', 'PV5READ', 
        'PV1SCIE', 'PV2SCIE', 'PV3SCIE', 'PV4SCIE', 'PV5SCIE']
        
# Read pisa file.
df = pandas.read_csv("pisa2012.csv", index_col=False, usecols=cols, encoding='utf-8')

# Melt columns of test types into 2 columns: PVTYPE, SCORE
pvs = ['PV1MATH', 'PV2MATH', 'PV3MATH', 'PV4MATH', 'PV5MATH', 
       'PV1READ', 'PV2READ', 'PV3READ', 'PV4READ', 'PV5READ', 
       'PV1SCIE', 'PV2SCIE', 'PV3SCIE', 'PV4SCIE', 'PV5SCIE']
iv = ['CNT', 'SCHOOLID', 'ESCS', 'W_FSTUWT']
df2 = df.melt(id_vars=iv, value_vars=pvs,
                var_name='PVTYPE', value_name='SCORE')

# Split subject and test type and create new column
df2 = df2.assign(PVNUM=df2['PVTYPE'].apply(lambda x: x[2]), SUBJECT=df2['PVTYPE'].apply(lambda x: x[3:]))

# Function for grouping by country include coef between ESCS and performance.
def f_c(group):
    s = group['SCORE']
    e = group['ESCS']
    w = group['W_FSTUWT']
    #apply the weighted mean.
    savg = (s*w).sum()/w.sum()
    eavg = (e*w).sum()/w.sum()
    cnt = s.count()
    if not e.isnull().all():
        lm = sm.ols(formula="SCORE ~ ESCS", data=group, missing='drop').fit()
        coef = lm.params.ESCS
        rsqured = lm.rsquared
    else:
        coef = None
        rsqured = None
    return pandas.DataFrame({'MEANSCORE':savg, 'MEANESCS':eavg, 'COUNT': cnt, 'COEF':coef, 'RSQURED':rsqured}, index=[0])

# Group by country and subject.
grouped = df2.groupby(['CNT','SUBJECT']).apply(f_c)

# Remove null rows (include Albania data).
grouped = g2[g2.COEF.notnull()]

grouped.to_csv("group_by_country.csv")

