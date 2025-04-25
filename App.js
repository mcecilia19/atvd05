import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Avatar, Button, Input } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import { ListItem } from '@rneui/themed';
import { useState } from 'react';
import axios from 'axios';

const Stack = createStackNavigator();

const cores = {
  principal: '#3498db',
  secundario: '#2980b9',
  claro: '#e1f5fe',
  escuro: '#2c3e50',
  destaque: '#1abc9c',
};

function Login({ navigation }) {
  return (
    <View>
      <Avatar
        size={100}
        rounded
        source={{ uri: "https://media.licdn.com/dms/image/v2/D4D03AQGi_zQ3KPZz3A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1670178002431?e=2147483647&v=beta&t=v2xh_fLiT68IyOO_TvM3IFtbErpporfiBO0GiR3ry1w" }}
      />
      <Text>Bem-vindo</Text>
      <Text>Login</Text>
      <Input placeholder='digite seu login' />
      <Text>Senha</Text>
      <Input placeholder='digite sua senha' />
      <Button title="Login" onPress={() => navigation.navigate('Listacontatos')} />
      <Button title="Cadastrar" onPress={() => navigation.navigate('Cadastro')} />
    </View>
  );
}

function Listacontatos({ navigation }) {
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/contatos')
      .then((response) => {
        setContatos(response.data);
      })
      .catch((error) => {
        console.error('Não foi possível acessar os contatos', error);
      });
  }, []);

  return (
    <View>
      {contatos.map((contato, i) => (
        <ListItem
          key={i}
          bottomDivider
          onPress={() => navigation.navigate('Alterarcontato', { contato })}
        >
          <Avatar source={{ uri: 'https://cdn-icons-png.flaticon.com/512/552/552721.png' }} size='medium' rounded />
          <ListItem.Content>
            <ListItem.Title>{contato.nome}</ListItem.Title>
            <ListItem.Subtitle>{contato.numero}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
      <Button title="Adicionar contato" onPress={() => navigation.navigate('Cadastrocontato')} />
    </View>
  );
}


function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const salvarCadastro = () => {
    axios.post('http://localhost:3000/usuarios', {
      nome, cpf, email, senha
    })
    .then(() => navigation.navigate('Login'))
    .catch((err) => console.log(err));
  };

  return (
    <View>
      <Text>Cadastro de Usuário</Text>
      <Text>Nome</Text>
      <Input placeholder='Digite seu nome' 
      value={nome}
      onChangeText={setNome}/>
      <Text>CPF</Text>
      <Input placeholder='Digite seu CPF' 
      value={cpf}
      onChangeText={setCpf}/>
      <Text>Email</Text>
      <Input placeholder='Digite seu email'
      value={email}
      onChangeText={setEmail}/>
      <Text>Senha</Text>
      <Input placeholder='Digite sua senha'
      value={senha}
      onChangeText={setSenha}/>
      <Button title="Salvar" onPress={salvarCadastro}/>
    </View>
  );
}

function Cadastrocontato({ navigation }) {
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');

  const salvarContato = () => {
    axios.post('http://localhost:3000/contatos', {
      nome, numero
    })
    .then(() => navigation.navigate('Listacontatos'))
    .catch((err) => console.log(err));
  };

  return (
    <View>
      <Text>Novo Contato</Text>
      <Text>Nome</Text>
      <Input placeholder='Digite o nome' value={nome} onChangeText={setNome} />
      <Text>Email</Text>
      <Input placeholder='Digite o email' />
      <Text>Telefone</Text>
      <Input placeholder='Digite o telefone' value={numero} onChangeText={setNumero} />
      <Button title="Salvar" onPress={salvarContato} />
    </View>
  );
}


function Alterarcontato({ route, navigation }) {
  const { contato } = route.params;
  const [name, setName] = useState(contato.nome);
  const [numero, setNumero] = useState(contato.numero);

  const atualizarContato = () => {
    axios.put(`http://localhost:3000/contatos/${contato.id}`, {
      nome: name,
      numero: numero
    })
    .then(() => navigation.navigate('Listacontatos'))
    .catch((err) => console.log(err));
  };

  return (
    <View>
      <Text>Editar Contato</Text>
      <Text>Nome</Text>
      <Input
        placeholder='Nome'
        value={name}
        onChangeText={setName}
      />
      <Text>Telefone</Text>
      <Input
        placeholder='Telefone'
        value={numero}
        onChangeText={setNumero}
      />
      <Button title='Alterar' onPress={atualizarContato} />
      <Button title='Excluir'/>
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerStyle: { backgroundColor: cores.principal },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name='Login' component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name='Listacontatos' component={Listacontatos} options={{ title: 'Contatos' }} />
        <Stack.Screen name='Cadastro' component={Cadastro} options={{ title: 'Cadastro' }} />
        <Stack.Screen name='Cadastrocontato' component={Cadastrocontato} options={{ title: 'Novo Contato' }} />
        <Stack.Screen name='Alterarcontato' component={Alterarcontato} options={{ title: 'Editar Contato' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
