/* eslint-disable react/style-prop-object */
import React, { useState, useCallback, useEffect } from 'react';
import { View, Switch, Image } from 'react-native';
import { Button, Select, Text } from 'react-native-magnus';

import ModalDatePicker from '../ModalDatePicker';
import { formatDate } from '../../utils/dateFormat';
import { getUserInfo, saveUserInfo } from '../../services/LocalStorageService';

import pencil from '../../../assets/pencil.png';
import save from '../../../assets/save.png';

import styles from './styles';

import { VACCINES } from './constants';

function UserInfo() {
  const [editable, setEditable] = useState(false);
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

  return (
    <View style={styles.user}>
      <View style={styles.wrap}>
        <Text mb={10} fontWeight="bold" fontSize="2xl">
          Mis datos
        </Text>
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
              onValueChange={setVaccinated}
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
                  <Text style={{ marginRight: 5, marginVertical: 2 }}>
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
                  onSelect={setVaccine}
                  ref={vaccineRef}
                  value={vaccine && vaccine.name}
                  title="Elija la vacuna"
                  roundedTop="xl"
                  data={VACCINES}
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
                  onSelect={setDose}
                  ref={doseRef}
                  value={vaccine && vaccine.name}
                  title="¿Cuantas dosis se dió?"
                  roundedTop="xl"
                  data={[1, 2]}
                  renderItem={item => (
                    <Select.Option value={item} py="md" px="xl">
                      <Text>{item}</Text>
                    </Select.Option>
                  )}
                />
              </View>
            </View>
            <View>
              <View style={[styles.wrap, !editable && styles.nonEditable]}>
                <Text styles={{ marginVertical: 5 }}>
                  {'Fecha de\núltima dosis:'}
                </Text>
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
              onValueChange={setBeenInfected}
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
              <Text>Fecha de alta:</Text>
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
