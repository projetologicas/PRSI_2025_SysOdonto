# 🦷 SysOdonto – Sistema Web para Gestão Odontológica

## 📄 Descrição do Projeto

### Autor 👤

O projeto **SysOdonto** foi desenvolvido por alunos do curso de **Análise e Desenvolvimento de Sistemas** do **IFSP – Campus Araraquara**.

- **Cauã Grigolatto Domingos** (Líder)  
- **Gabriel de Pauli Santos**  
- **Gabriel Dellatore Ezequiel**  
- **Gabriel Ventura Pires**  
- **João Pedro da Silva Vieira**

---

## 🧑‍💻 Tecnologias utilizadas

- **Java (JDK 21):** Linguagem principal utilizada no backend do sistema.  
- **Spring Boot:** Framework utilizado para construção da API REST e organização da camada de aplicação.  
- **React / PrimeReact:** Utilizado no frontend para criação de uma interface web moderna, responsiva e intuitiva.  
- **Firebase Authentication:** Responsável pela autenticação de usuários (dentistas).  
- **Google Firestore:** Banco de dados NoSQL em nuvem utilizado para persistência dos dados.  
- **API REST:** Comunicação entre frontend e backend.  
- **API de Mensageria (WhatsApp):** Utilizada para envio automático de lembretes de consultas aos pacientes.  
- **Git & GitHub:** Controle de versão e hospedagem do repositório do projeto.  
- **Trello:** Gerenciamento das tarefas do projeto utilizando metodologia ágil (Kanban).  
- **Canva:** Utilizado para criação e validação dos protótipos de interface.

---

## ℹ️ Sobre o projeto

O **SysOdonto** é um sistema web desenvolvido para **clínicas odontológicas de pequeno e médio porte**, com o objetivo de **centralizar a gestão de pacientes e consultas**, além de **automatizar o envio de lembretes de consultas via WhatsApp**.

O projeto surgiu a partir da identificação de um problema comum em consultórios odontológicos: o uso de **agendas físicas**, **planilhas dispersas** e **comunicação manual**, que resultam em falhas administrativas, perda de informações e altos índices de não comparecimento às consultas.

---

## 🦷 Funcionalidades principais

### 👤 Usuário (Dentista)
- Cadastro e autenticação de usuários.
- Gerenciamento de sessão segura.
- Acesso exclusivo aos seus pacientes e consultas.

### 🧑‍⚕️ Pacientes
- Cadastro de pacientes com:
  - Nome, CPF, telefone e data de nascimento.
  - Data de início do tratamento.
  - Observações clínicas.
  - Foto (opcional).
- Prontuário odontológico integrado.
- Odontograma personalizável.
- Importação de pacientes em massa (CSV/JSON).

### 📅 Consultas
- Cadastro, edição e exclusão de consultas.
- Verificação automática de conflitos de horário.
- Associação entre paciente, dentista e consulta.
- Visualização da agenda de forma organizada.

### 📲 Comunicação
- Envio automático de lembretes de consulta via WhatsApp.
- Redução de faltas e melhora no relacionamento com o paciente.

---

## 🏗️ Arquitetura do Sistema

O SysOdonto utiliza uma **arquitetura em camadas**, baseada no padrão **Cliente-Servidor**, composta por:

- **Camada de Apresentação:** Aplicação web em React.
- **Camada de Aplicação:** API REST desenvolvida em Java com Spring Boot.
- **Camada de Dados:** Google Firestore (NoSQL), com organização em coleções de documentos.

Essa arquitetura facilita a manutenção, escalabilidade e evolução futura do sistema.

---

## 🎯 Objetivos do SysOdonto

- Reduzir o esforço manual das equipes administrativas.
- Organizar e centralizar dados clínicos e cadastrais.
- Diminuir taxas de absenteísmo em consultas.
- Oferecer uma solução intuitiva para usuários com pouca familiaridade tecnológica.
- Fortalecer a relação entre clínica e paciente.
