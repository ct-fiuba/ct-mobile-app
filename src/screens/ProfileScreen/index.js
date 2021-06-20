/* eslint-disable react/style-prop-object */
import React, { useState, useCallback, useEffect } from 'react';
import { View, Switch, SafeAreaView, Platform } from 'react-native';
import { Button, Select, Text, Icon } from 'react-native-magnus';
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
} from 'expo-status-bar';

import ModalDatePicker from '../../components/ModalDatePicker';

import { getUserInfo, saveUserInfo } from '../../services/LocalStorageService';

import styles from './styles';

import { VACCINES } from './constants';

function ProfileScreen() {
  if (Platform.OS === 'android') {
    setStatusBarBackgroundColor('blue');
    setStatusBarStyle('inverted');
  }

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
    setMedicalDischargeDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    );
  }, []);

  const onDateCancel = useCallback(() => {
    setVisibleDate(false);
    setMedicalDischargeDate('');
  }, []);

  const onDoseDateConfirmed = useCallback(date => {
    setVisibleDoseDate(false);
    setLastDoseDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    );
  }, []);

  const onDoseDateCancel = useCallback(() => {
    setVisibleDoseDate(false);
    setLastDoseDate('');
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <SafeAreaView style={styles.headerContent}>
          <Text style={styles.name}>Olivia Fernandez</Text>
          <Text style={styles.small}>olifer97@gmail.com</Text>
          <Text style={styles.small}>40.244.911</Text>
        </SafeAreaView>
      </View>
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
            <Text>{editable ? 'Guardar' : 'Editar'}</Text>
            <Icon
              color="black"
              name={editable ? 'save' : 'edit'}
              fontSize="3xl"
            />
          </Button>
        </View>

        <View style={styles.form}>
          <View style={styles.wrap}>
            <Text fontWeight="bold" fontSize={15}>
              ¿Esta Vacunado?
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              style={styles.toggle}
              onValueChange={setVaccinated}
              value={vaccinated}
              disabled={!editable}
            />
          </View>
          {vaccinated && (
            <View>
              <View>
                <View style={styles.wrap}>
                  <Text>Vacuna:</Text>
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
                    {vaccine ? vaccine.name : 'No especifica'}
                  </Button>
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
                <View style={styles.wrap}>
                  <Text>Dosis:</Text>
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
                    {dose ? dose.toString() : 'No especifica'}
                  </Button>
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
              <View>
                <View style={styles.wrap}>
                  <Text>{'Fecha de\núltima dosis:'}</Text>
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
                    {lastDoseDate || 'No especifica'}
                  </Button>
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
          <View style={styles.wrap}>
            <Text fontWeight="bold" fontSize={15}>
              ¿Ha estado infectado?
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              style={styles.toggle}
              onValueChange={setBeenInfected}
              value={beenInfected}
              disabled={!editable}
            />
          </View>
          {beenInfected && (
            <View>
              <View style={styles.wrap}>
                <Text>Fecha de alta:</Text>
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
                  {medicalDischargeDate || 'No especifica'}
                </Button>
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
    </View>
  );
}

export default ProfileScreen;
