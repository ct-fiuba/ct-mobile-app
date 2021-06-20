import React, { useState, useCallback } from 'react';
import { View, Switch, SafeAreaView } from 'react-native';
import { Button, Select, Text, Icon } from 'react-native-magnus';

import ModalDatePicker from '../../components/ModalDatePicker';

import styles from './styles';

import { VACCINES } from './constants';

const useToggleState = (initialState = false) => {
  const [checked, setChecked] = React.useState(initialState);

  const onCheckedChange = isChecked => {
    setChecked(isChecked);
  };

  return { checked, onChange: onCheckedChange };
};

function ProfileScreen() {
  const [editable, setEditable] = useState(false);
  const vaccinatedState = useToggleState();
  const [vaccine, setVaccine] = useState(null);
  const [dose, setDose] = useState(1);
  const vaccineRef = React.createRef();
  const doseRef = React.createRef();
  const beenInfectedState = useToggleState();
  const [medicalDischargeDate, setMedicalDischargeDate] = useState('');
  const [visibleDate, setVisibleDate] = useState(false);
  const [visibleDoseDate, setVisibleDoseDate] = useState(false);
  const [lastDoseDate, setLastDoseDate] = useState('');

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
            onPress={() => {
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
              onValueChange={vaccinatedState.onChange}
              value={vaccinatedState.checked}
              disabled={!editable}
            />
          </View>
          {vaccinatedState.checked && (
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
              onValueChange={beenInfectedState.onChange}
              value={beenInfectedState.checked}
              disabled={!editable}
            />
          </View>
          {beenInfectedState.checked && (
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
