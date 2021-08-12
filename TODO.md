# TODO

- [ ] __250__ - lahat ng required fields ay lagyan ng (*) mula admin,registrar,teacher,student
- [ ] __250__ - dapat nag aauto upper case lahat ng nasa unahan na name mapa First Name, Middle,Last Name.
- [ ] __0__ - baka po pede ung credentials ng student . dba nung nakaraan ay every mag increment ay nag change ng password. Baka pede kapag may student id and password ay permanent na sya kahit maincrement pa sya

## Pre Registration

- [ ] __1000__ - Pre registration – kapag same data yung ininput dapat okay button nlng hindi confirm. Example same data yung ininput sa pre-register pagkaclick ng submit eto dapat lalabas sa modal “your data is already exists” tas okay button exit. Wala ng confirm para maiwasan ang pagduplicate ng data ng student.
- [ ] __1000__ - admissions table new columns, 'reference number', 'name', 'gender', 'course and major', 'year level', 'semester', 'payment status', 'actions'
- [ ] __500__ - After mag pre register ng students dba may submit button dun. Pagclick ng submit may modal na lalabas “Successfully Registered ! Please settle your payment to enroll the subjects. Partially paid minimum of “500 ” pesos if fully paid please pay the stated amount of “10,000” pesos”.Tapos ok button. Then kung ano yang nakalagay sa modal yan din ang dadating sa email ngstudents kasama ng reference number(auto generated)
- [ ] __500__ - Birthday inputs maximum should be 2004 instead of 2006
- [ ] __0__ - Alisin na yung checkbox sa Requirements. Display nlang sya sa baba as a label.

## Registrar

- [ ] __3000__ - Diba every incremented ska ka lang makapag set ng schedules. So ganito dapt bago maadmit ang students dapat may plotted na schedules agad . kasi ang angyare sa system nung una nid mo muna admit ang student para magkaroon ng sections. Dapat bago maadmit ang student pede na makapag plot ng schedules lahat na ng schedule sap ag set ay kailangan sama sama na . pede Kadin makapag plot ng second sem na schedule gang fouthyear. Para kada admit ng students ay meron na agad silang sched na makikita. Hindi na ung every incremented set ng new school year at semester ska kalang magpplot ng schedules
- [ ] __1500__ - madagdagan pala ng button para sa apg add ng “room & section” kailangan makapag input si registrar kung ilang students lang ang pwede sa isang section bawat room. Kasi dba nakafixed yung section kung ilang students sa isang section. So dapt maeedit ni registrar un. Sya ung mag set
- [ ] __1000__ - reference numbers will be changed to their student IDs once admitted
- [ ] __1000__ - only light mode, theming: 'sky blue', 'white'
- [ ] __1000__ - Sa pag set ng school year dapat may adjustment period atleast 1 or 2 weeks.  Kasi ibig sabihin kasi kaapg nagset ka ng school year at semester start at end dapat start na agad ng klase kapag ganun wala man lang adjustment period. Diba kasama sap ag set ng school year yung encoding of grades start, || tas lahat ng format ng date na ginamit ay same format lahat ex 2021-08-10 ganyan lahat hindi yung start 2021-08-10   end August 10 2021
- [ ] __500__ - lahat ng button na gagamitin mula admin , registrar,teacher, student ay dapt may “TOOL TIP”
- [ ] __250__ - may sariling time zone ang system wag magbase sa time ng device na ginamit
- [ ] __250__ - Sa pagset ng registration date kailangan mag start lang sa current year. Ex. Ngyong year tapos nag set ka ng registration date ay 2018 dapat hindi sila makapag register kapag ganun . focus dapat sa current year.
- [ ] __250__ - With logo daw po ng EMC bawat notify sa email ng students
- [ ] __250__ - pag input ni teacher ng grades dapat included padin ung mga point . example 74.89 dapat automatic mag round off na sya para sa 75
- [ ] __0__ - ung word na "behind" palitan ng word na 'With Deficiency'
- [ ] __0__ - registrar mails should be complete name
- [ ] __0__ - Sa pag set ng school year wala ng delete button edit lang

## Teacher

- [ ] __250__ - Dapat may remarks sa gilid ng grades para alam din ni teacher kung anong status ng students nya. If failed , passed, or INC.
- [ ] __250__ - Dun sa button subjects dba pagclick nun andun ung mga subject tas yun word na “VIEW SUBJECT” dapat name ng teacher ang nakadisplay dun.

## Student

- [ ] __3000__ - Dapat maeenrol padin ni student yung mga failed subject sa 2nd year for example si student m ay failed subject sa first year 1st sem or 2nd sem at gusto nya kunin sa 2nd year 1st sem or 2nd sem makikita padin nya ung mga failed subject nya kapag nag enroll sya ng 2nd year . example 7 subjects ang given para sa 2nd year 1st sem tapos nakalagya sa baba yung mga failed subjects na pede nya menrol depende sa units na sinet ni registrar na units allowed per sem.
- [ ] __1000__ - diba kapag nag iincrement may modal na nalabas para sa pagset ng new school year at semester || tapos kapag okay na may another modal padin nalalabas na “are you sure you want to evaluate the students” tas confirm dba? Pagka confirm may loading dapat sa gitna ng Screen para sa pag process ng students, yung loading tlaga kahit pacircular na Malaki wag naman sobra😁basta hindi notification sa gilid lalabas tulad ng dati. Tapos pagkaload another modal yung mga results sa pagprocess ng student kung ilang ung passed students, yung may failed at missing. Tas okay button. Pag ka increment di na dpat makapg ng schedule kasi dapat dun palang sa 1st year pede na maset dun lahat ng sched aadapt nlng sya ng system papunta sa student schedules.
- [ ] __500__ - Yung dashboard na word ay papalitan ng word na “Reminder/s” dyan papasok ung mga remaining balance ng student of partially paid palang sya para maremind sya na nid nya masettled yung balance nya bago mag end ang semester kung hindi ay maiiwan sya kapg nag increment. Tapos dyan din papasok ung si student ay may failed subject/s dapat manotif din sya na may failed subject/s sya. Parang style admission may number ng notifcation
- [ ] __500__ - palagay ng mga logo dun sa pag print ng certificate of enrollment
- [ ] __0__ - Sidebar should display, year, section, level, course, major and semester
