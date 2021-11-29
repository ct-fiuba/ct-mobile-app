/* eslint-disable react/style-prop-object */
import React, { useState, useCallback, useEffect } from 'react';
import { View, Switch, Image } from 'react-native';
import { Button, Icon, Select, Text, Tooltip } from 'react-native-magnus';

import ModalDatePicker from '../ModalDatePicker';
import { formatDate } from '../../utils/dateFormat';
import { getUserInfo, saveUserInfo } from '../../services/LocalStorageService';
import { getVaccines } from '../../services/CTUserAPIService';

import pencil from '../../../assets/pencil.png';
import save from '../../../assets/save.png';

import styles from './styles';

function UserInfo({ editable, setEditable, disableTooltip, disableText }) {
  const [vaccinated, setVaccinated] = useState(false);
  const [vaccine, setVaccine] = useState(null);
  const [dose, setDose] = useState(1);
  const vaccineRef = React.createRef();
  const doseRef = React.createRef();
  const [beenInfected, setBeenInfected] = useState(false);
  const [medicalDischargeDate, setMedicalDischargeDate] = useState('');
  const [visibleDate, setVisibleDate] = useState(false);
  const [visibleDoseDate, setVisibleDoseDate] = useState(false);
  const [lastDoseDate, setLastDoseDate] = useState('');
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [selectableVaccines, setSelectableVaccines] = useState([]);
  const [selectableDoses, setSelectableDoses] = useState([]);
  const lastDoseTooltipRef = React.createRef();
  const medicalDischargeTooltipRef = React.createRef();

  useEffect(() => {
    async function fetchData() {
      const userInfo = await getUserInfo();

      if (userInfo) {
        setVaccinated(userInfo.vaccinated);
        setVaccine(userInfo.vaccine);
        setDose(userInfo.dose);
        setBeenInfected(userInfo.beenInfected);
        setMedicalDischargeDate(userInfo.medicalDischargeDate);
        setLastDoseDate(userInfo.lastDoseDate);
      }
    }
    async function fetchVaccines() {
      const vaccines = await getVaccines();
      if (vaccines) {
        setVaccineOptions(vaccines);
        setSelectableVaccines(vaccines);
        setSelectableDoses([0]);
      }
    }
    fetchVaccines();
    fetchData();
  }, []);

  const onSave = async () => {
    const userInfo = {
      vaccinated,
      vaccine,
      dose,
      beenInfected,
      medicalDischargeDate,
      lastDoseDate,
    };
    await saveUserInfo(userInfo);
  };

  const onDateConfirmed = useCallback(date => {
    setVisibleDate(false);
    setMedicalDischargeDate(formatDate(date));
  }, []);

  const onDateCancel = useCallback(() => {
    setVisibleDate(false);
    setMedicalDischargeDate('');
  }, []);

  const onDoseDateConfirmed = useCallback(date => {
    setVisibleDoseDate(false);
    setLastDoseDate(formatDate(date));
  }, []);

  const onDoseDateCancel = useCallback(() => {
    setVisibleDoseDate(false);
    setLastDoseDate('');
  }, []);

  const getSelectableDoses = currentVaccine =>
    Array.from(Array(currentVaccine.shotsCount).keys());

  const getSelectableVaccineNames = currentDose =>
    vaccineOptions.filter(
      item => !currentDose || item.shotsCount >= currentDose
    );

  const onDosesChange = currentDose => {
    setSelectableVaccines(getSelectableVaccineNames(currentDose));
    setDose(currentDose);
  };

  const onVaccinatedChange = newVaccinated => {
    setVaccinated(newVaccinated);
    if (!newVaccinated) {
      setVaccine(null);
      setLastDoseDate('');
      setSelectableDoses([0]);
      onDosesChange(1);
    }
  };

  const onBeenInfectedChange = useCallback(newBeenInfected => {
    setBeenInfected(newBeenInfected);
    if (!newBeenInfected) {
      setMedicalDischargeDate('');
    }
  }, []);

  const onVaccineChange = currentVaccine => {
    setSelectableDoses(getSelectableDoses(currentVaccine));
    setVaccine(currentVaccine);
  };

  return (
    <View style={styles.user}>
      <View style={styles.wrap}>
        <Text mb={10} fontWeight="bold" fontSize="2xl">
          Mis datos
        </Text>
        <Tooltip ref={disableTooltip} text={disableText}>
          <Button
            bg="transparent"
            rounded="circle"
            onPress={async () => {
              if (editable) {
                await onSave();
              }
              setEditable(!editable);
            }}
          >
            <Text mr={5}>{editable ? 'Guardar' : 'Editar'}</Text>
            <Image
              source={editable ? save : pencil}
              style={{ width: 30, height: 30 }}
            />
          </Button>
        </Tooltip>
      </View>

      <View style={styles.form}>
        <View style={styles.wrap}>
          <Text fontWeight="bold" fontSize={15}>
            ¿Está Vacunado?
          </Text>
          {editable ? (
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              style={styles.toggle}
              onValueChange={onVaccinatedChange}
              value={vaccinated}
              disabled={!editable}
            />
          ) : (
            <Text>{vaccinated ? 'Si' : 'No'}</Text>
          )}
        </View>
        {vaccinated && (
          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View>
                <View style={[styles.wrap, !editable && styles.nonEditable]}>
                  <Text
                    style={{
                      paddingLeft: 5,
                      marginRight: 5,
                      marginVertical: 2,
                    }}
                  >
                    Vacuna:
                  </Text>
                  {editable ? (
                    <Button
                      mb={10}
                      borderWidth={1}
                      bg="white"
                      color="gray900"
                      borderColor="gray300"
                      onPress={() => {
                        if (vaccineRef.current) {
                          vaccineRef.current.open();
                        }
                      }}
                      disabled={!editable}
                    >
                      {vaccine ? vaccine.name : '-'}
                    </Button>
                  ) : (
                    <Text styles={{ padding: 30 }}>
                      {vaccine ? vaccine.name : '-'}
                    </Text>
                  )}
                </View>

                <Select
                  onSelect={onVaccineChange}
                  ref={vaccineRef}
                  value={vaccine && vaccine.name}
                  title="Elija la vacuna"
                  roundedTop="xl"
                  data={selectableVaccines}
                  renderItem={item => (
                    <Select.Option value={item} py="md" px="xl">
                      <Text>{item.name}</Text>
                    </Select.Option>
                  )}
                />
              </View>
              <View>
                <View style={[styles.wrap, !editable && styles.nonEditable]}>
                  <Text style={{ marginRight: 5, marginVertical: 2 }}>
                    Dosis:
                  </Text>
                  {editable ? (
                    <Button
                      mb={10}
                      borderWidth={1}
                      bg="white"
                      color="gray900"
                      borderColor="gray300"
                      onPress={() => {
                        if (doseRef.current) {
                          doseRef.current.open();
                        }
                      }}
                      disabled={!editable}
                    >
                      {dose ? dose.toString() : '-'}
                    </Button>
                  ) : (
                    <Text> {dose ? dose.toString() : '-'}</Text>
                  )}
                </View>

                <Select
                  onSelect={onDosesChange}
                  ref={doseRef}
                  value={vaccine && vaccine.name}
                  title="¿Cuantas dosis se dió?"
                  roundedTop="xl"
                  data={selectableDoses}
                  renderItem={item => (
                    <Select.Option value={item + 1} py="md" px="xl">
                      <Text>{item + 1}</Text>
                    </Select.Option>
                  )}
                />
              </View>
            </View>
            <View>
              <View style={[styles.wrap, !editable && styles.nonEditable]}>
                <Tooltip
                  ref={lastDoseTooltipRef}
                  text="La fecha de la última dosis es anonimizada al momento de cargar visitas"
                >
                  <Button
                    p={5}
                    bg="white"
                    styles={styles.tooltipButtons}
                    onPress={() => {
                      if (lastDoseTooltipRef.current) {
                        lastDoseTooltipRef.current.show();
                      }
                    }}
                  >
                    <Text>{'Fecha de última dosis: '}</Text>
                    <Icon
                      name="question"
                      fontFamily="SimpleLineIcons"
                      fontSize={14}
                      color="black"
                      h={15}
                      w={15}
                    />
                  </Button>
                </Tooltip>
                {editable ? (
                  <Button
                    borderWidth={1}
                    bg="white"
                    color="gray900"
                    borderColor="gray300"
                    onPress={() => {
                      setVisibleDoseDate(true);
                    }}
                    disabled={!editable}
                  >
                    {lastDoseDate || '-'}
                  </Button>
                ) : (
                  <Text>{lastDoseDate || '-'}</Text>
                )}
              </View>

              <ModalDatePicker
                id="lastDose"
                visible={visibleDoseDate}
                onConfirm={onDoseDateConfirmed}
                onCancel={onDoseDateCancel}
                value={lastDoseDate}
                confirmText="Confirmar"
                cancelText="Cancelar"
              />
            </View>
          </View>
        )}
        <View style={[styles.wrap, !editable && styles.nonEditable]}>
          <Text fontWeight="bold" fontSize={15}>
            ¿Ha estado infectado?
          </Text>
          {editable ? (
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              style={styles.toggle}
              onValueChange={onBeenInfectedChange}
              value={beenInfected}
              disabled={!editable}
            />
          ) : (
            <Text>{beenInfected ? 'Si' : 'No'}</Text>
          )}
        </View>
        {beenInfected && (
          <View>
            <View style={[styles.wrap, !editable && styles.nonEditable]}>
              <Tooltip
                ref={medicalDischargeTooltipRef}
                text="La fecha de alta es anonimizada al momento de cargar visitas"
              >
                <Button
                  p={5}
                  bg="white"
                  styles={styles.tooltipButtons}
                  onPress={() => {
                    if (medicalDischargeTooltipRef.current) {
                      medicalDischargeTooltipRef.current.show();
                    }
                  }}
                >
                  <Text>Fecha de alta: </Text>
                  <Icon
                    name="question"
                    fontFamily="SimpleLineIcons"
                    fontSize={14}
                    color="black"
                    h={15}
                    w={15}
                  />
                </Button>
              </Tooltip>
              {editable ? (
                <Button
                  borderWidth={1}
                  bg="white"
                  color="gray900"
                  borderColor="gray300"
                  onPress={() => {
                    setVisibleDate(true);
                  }}
                  disabled={!editable}
                >
                  {medicalDischargeDate || '-'}
                </Button>
              ) : (
                <Text>{medicalDischargeDate || '-'}</Text>
              )}
            </View>

            <ModalDatePicker
              id="medicalDischarge"
              visible={visibleDate}
              onConfirm={onDateConfirmed}
              onCancel={onDateCancel}
              value={medicalDischargeDate}
              confirmText="Confirmar"
              cancelText="No tengo el alta todavía"
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default UserInfo;
