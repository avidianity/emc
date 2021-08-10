# TODO

- [ ] __250__ - lahat ng required fields ay lagyan ng (*) mula admin,registrar,teacher,student
- [ ] __250__ - dapat nag aauto upper case lahat ng nasa unahan na name mapa First Name, Middle,Last Name.
- [ ] __250__ - baka po pede ung credentials ng student . dba nung nakaraan ay every mag increment ay nag change ng password. Baka pede kapag may student id and password ay permanent na sya kahit maincrement pa sya

## Pre Registration

- [ ] __1000__ - Pre registration – kapag same data yung ininput dapat okay button nlng hindi confirm. Example same data yung ininput sa pre-register pagkaclick ng submit eto dapat lalabas sa modal “your data is already exists” tas okay button exit. Wala ng confirm para maiwasan ang pagduplicate ng data ng student.
- [ ] __500__ - Birthday inputs maximum should be 2004 instead of 2006
- [ ] __250__ - Alisin na yung checkbox sa Requirements. Display nlang sya sa baba as a label.

- [ ] __250__ - diba dun sa registrar side yung admission button ang laman ng mga table ay “Student Id”,” Student Name”, “Gender”,” Course”,” Year Level”,” Semester”,” Requirements”,” Actions
- [ ] __1000__ - Ngayon may mapapalitan at madadagdag sa table row. diba tulad ng nabanggit sa may pre register ng student mag kakaroon ng reference number after masubmit. Sabi kasi samen kapag di kapa admitted reference number palang gagamitin mo. So yung table row na Student Id sa may admission mapapalitan ng reference number tas yung requirements aalisin na sa table. Bali eto yung table row sa admission “Reference Number”,” Student Name”,” Gender”,” Course (may kasama padin tong major)”,” Year Level”,” Semester”,” Serial Number”,” Remaining Balance”,” Payment Status”,” Actions”

## Registrar

- [ ] __250__ - ung word na "behind" palitan ng word na “deficiencies”
- [ ] __1500__ - madagdagan pala ng button para sa apg add ng “room & section” kailangan makapag input si registrar kung ilang students lang ang pwede sa isang section bawat room. Kasi dba nakafixed yung section kung ilang students sa isang section. So dapt maeedit ni registrar un. Sya ung mag set

- [ ] __5000__ - After mag pre register ni student punta sya sa cashier kapag magbabayad sya tapos ung resibo na copy ni cashier dadalhin ni cashier sa registrar. Tapos madagdagan ng button ung registrar na “ Receipt Number” dyan sa loob ng receipt number dyan maiinput ni registrar yung “Serial Number” ng resibo. . example nagbayad si student ng 500 para sa tuition nya. Yung resibo na hawak ni cashier mapunta sa registrar tas iinput yung serial number ng resibo tas amount kung magkano tapos save na sya. Now ang gagawin naman ni student para maka enroll na sya ay mag lologin sya sa account nya gamit ung reference number na auto generated with password tapos pagka log in nya may modal na bubungad sa screen dapat maiinput din ni student ung serial number ng resibo na hawak nya tapos may upload receipt. Pagka upload nya may send to registrar na button . ang mangyare nyan ang magiging validation ay kailangan mag match serial number na ininput ni registrar at ung kay student. Kapag match sya ang status nung “ serial number ” dun sa admission table row ay “matched” kapg naman nauna mag upload ang student ng receipt with serial number ang status naman ng “serial number dun sa admission” is “Pending” kapag hindi naman nagmatched ay mag red sya na “ not matched”. || tapos ang purpose ng “remaining balance” dun sa admission table is example nagbayad si student ng 500 so matic ang balance nya is 9,500. Tapos tulad ng sinabi ko si admin ang maginput ng tuition kapag 10k below ang binayad ni student automatic partially paid(nakaword na sya parang disabled na) ang magiging status dun sa “Payment status” magiging fully paid lang sya kapag umabot ng10k ang binayad.  tapos  kapag naging matched ung serial number saka palang sya maadmit ni registrar.kapag naadmit na sya dun sa dulo ng name ng student madagdagan ng action button na “update payment” sa update payment dyan papasok kapag magbbayd nalet sya ng tuition nya same procedure ng payment sa admission may serial number padin at receipt so bali pag click ng button na update payment may modal dun, dyan na ma iinput ni registrar ung serial number at amount pagkasave dun naman sya papasok sa button na “Receipt Number” Kapag admitted na ang student manonotify ulet si student sa email nya. Tapos ung serial number hindi na dpat magagamit kapag nagupdate sya ng paymet kasi another resibo na let ung kapag nag update ng payment. Tapos ung reference number na ginamit ni student ay mapapalitan na ng “student Id” pagpasok dun sa list kasi admitted na sya. Ang dadating sa email ng student ay ex “camelle . you have been admitted to course: BSBA-Major in Financial management 1st year 1st semester

- [ ] __250__ - registrar mails should be complete name
- [ ] __500__ - With logo daw po ng EMC bawat notify sa email ng students
- [ ] __250__ - Sa pag set ng school year wala ng delete button edit lang
- [ ] __250__ - Sa pagset ng registration date kailangan mag start lang sa current year. Ex. Ngyong year tapos nag set ka ng registration date ay 2018 dapat hindi sila makapag register kapag ganun . focus dapat sa current year.
- [ ] __1000__ - Sa pag set ng school year dapat may adjustment period atleast 1 or 2 weeks.  Kasi ibig sabihin kasi kaapg nagset ka ng school year at semester start at end dapat start na agad ng klase kapag ganun wala man lang adjustment period. Diba kasama sap ag set ng school year yung encoding of grades start, || tas lahat ng format ng date na ginamit ay same format lahat ex 2021-08-10 ganyan lahat hindi yung start 2021-08-10   end August 10 2021
- [ ] __3000__ - Diba every incremented ska ka lang makapag set ng schedules. So ganito dapt bago maadmit ang students dapat may plotted na schedules agad . kasi ang angyare sa system nung una nid mo muna admit ang student para magkaroon ng sections. Dapat bago maadmit ang student pede na makapag plot ng schedules lahat na ng schedule sap ag set ay kailangan sama sama na . pede Kadin makapag plot ng second sem na schedule gang fouthyear. Para kada admit ng students ay meron na agad silang sched na makikita. Hindi na ung every incremented set ng new school year at semester ska kalang magpplot ng schedules
- [ ] __500__ - may sariling time zone ang system wag magbase sa time ng device na ginamit
- [ ] __500__ - lahat ng button na gagamitin mula admin , registrar,teacher, student ay dapt may “TOOL TIP”
- [ ] __1000__ - only light mode, theming: 'sky blue', 'white'
- [ ] __250__ - a pag input ni teacher ng grades dapat included padin ung mga point . example 74.89 dapat automatic mag round off na sya para sa 75

## Teacher

- [ ] __250__ - Dapat may remarks sa gilid ng grades para alam din ni teacher kung anong status ng students nya. If failed , passed, or INC.
- [ ] __250__ - Dun sa button subjects dba pagclick nun andun ung mga subject tas yun word na “VIEW SUBJECT” dapat name ng teacher ang nakadisplay dun.

## Administrator

- [ ] __500__ - Madagdagan ng button na “add tuition” makakapg input sya ng tuition para sa partially paid at fully paid. Example fully paid exactly 10,000 pesos , pede nya maedit yung 10,000 pesos incase na magbaba ang tuition fees ng school. Tapos  kapag below 10,000 automatic ang status ng student ay partially. Si admin ang magseset nun.

## Student

- [ ] __3000__ - Dapat maeenrol padin ni student yung mga failed subject sa 2nd year for example si student m ay failed subject sa first year 1st sem or 2nd sem at gusto nya kunin sa 2nd year 1st sem or 2nd sem makikita padin nya ung mga failed subject nya kapag nag enroll sya ng 2nd year . example 7 subjects ang given para sa 2nd year 1st sem tapos nakalagya sa baba yung mga failed subjects na pede nya menrol depende sa units na sinet ni registrar na units allowed per sem.
- [ ] __500__ - Yung dashboard na word ay papalitan ng word na “Reminder/s” dyan papasok ung mga remaining balance ng student of partially paid palang sya para maremind sya na nid nya masettled yung balance nya bago mag end ang semester kung hindi ay maiiwan sya kapg nag increment. Tapos dyan din papasok ung si student ay may failed subject/s dapat manotif din sya na may failed subject/s sya. Parang style admission may number ng notifcation
- [ ] __250__ - palagay ng mga logo dun sa pag open ng schedule ng student, pag open ng grades, pag eenrol ng subjects.
- [ ] __250__ - Sidebar should display, year, section, level and semester
- [ ] __1000__ - iba kapag nag iincrement may modal na nalabas para sa pagset ng new school year at semester || tapos kapag okay na may another modal padin nalalabas na “are you sure you want to evaluate the students” tas confirm dba? Pagka confirm may loading dapat sa gitna ng Screen para sa pag process ng students, yung loading tlaga kahit pacircular na Malaki wag naman sobra😁basta hindi notification sa gilid lalabas tulad ng dati. Tapos pagkaload another modal yung mga results sa pagprocess ng student kung ilang ung passed students, yung may failed at missing. Tas okay button. Pag ka increment di na dpat makapg ng schedule kasi dapat dun palang sa 1st year pede na maset dun lahat ng sched aadapt nlng sya ng system papunta sa student schedules.
