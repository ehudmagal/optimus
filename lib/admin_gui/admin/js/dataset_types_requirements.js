/*
* each entity in dataset_types_requirements contains:
* 1. dataset_type_id which it belongs to.
* 2.an array of parents. each parent defines the attributes of the parent dataset,required to define new dataset of this type.
* attributes of parent are : unit_calc_type, and they are shown in "http://do1.phytech.com/activeadmin/dataset_types.json?per_page=-1".
* 3. an array of calc_parameters.
* each calc_parameter is a parameter should be added manually to the new dataset in order to calculate its formula.
* 4.sensor_type_titles. a project should own a group of sensors with these titles in order to create calculation of this type.
* */





