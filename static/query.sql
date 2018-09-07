select 
lunch_date, (select sum(sub_fct.baseline) from fct_table as sub_fct where lunch_date <= main_fct.lunch_date ) as inc_base, 
(select sum(sub_fct.actual) from fct_table as sub_fct where lunch_date <= main_fct.lunch_date ) as inc_actual 
from 
fct_table as main_fct