#muita coisa mudou desse documento!!    
Aluno: Bruno Santos Ferreira

**Projeto de Software Web: Gerenciamento e Emissão de Certificados em Cursos Preparatórios**    

![][image1]

Domínio da Informação:

Nome da Aplicação

**Sistema de Gestão de Certificados \- Hábeis Centro Educacional** 

Descrição Geral do Produto

O sistema tem como objetivo oferecer certificados de cursos preparatórios de qualidade em diversas áreas para concurseiros, fornecendo uma plataforma online acessível e conveniente para candidatos que precisam de certificados para inscrição em concursos públicos.

Nosso público-alvo principal são concurseiros que buscam preparação para concursos públicos nas áreas administrativa, jurídica, saúde, educação, entre outras. Também atender profissionais que desejam aprimorar habilidades e conhecimentos através de cursos preparatórios específicos.

Os processos de negócio envolvem desde a seleção e desenvolvimento dos cursos, criação e disponibilização dos materiais de estudo, matrícula dos alunos até a emissão dos certificados após a conclusão.

O site opera em conformidade com todas as regulamentações pertinentes ao fornecimento de cursos preparatórios e emissão de certificados, garantindo a legalidade e validade dos documentos emitidos.

Descrição dos Requisitos

1\. Gerenciamento de Cursos  
\- Descrição: Sistema para gerenciar eficientemente os cursos preparatórios oferecidos  
\- Informações Registradas:   
  \- ID (identificador único)  
  \- Título do curso  
  \- Descrição detalhada  
  \- Nome do instrutor  
  \- Preço  
  \- Duração (em horas)

2\. Gerenciamento de Alunos  
\- Descrição: Sistema para cadastro e controle de alunos  
\- Informações Registradas:  
  \- ID (identificador único)  
  \- Nome completo  
  \- Email (único)  
  \- Senha (criptografada)  
  \- Data de cadastro

3\. Sistema de Matrículas  
\- Descrição: Sistema para gerenciar as matrículas dos alunos nos diversos cursos  
\- Informações Registradas:  
  \- ID da matrícula  
  \- ID do aluno  
  \- ID do curso  
  \- Data da matrícula  
  \- Status (Ativa, Concluída, Cancelada)

4\. Emissão de Certificados  
\- Descrição: Sistema automático para emissão de certificados após conclusão do curso  
\- Informações Registradas:  
  \- ID do certificado  
  \- ID do aluno  
  \- ID do curso  
  \- Data de emissão  
  \- Código de validação

Casos de Uso

Caso de Uso 1: Gerenciamento de Cursos  
Ator Principal: Administrador do Sistema

Fluxo Principal:   
1\. Administrador acessa o painel de gerenciamento de cursos  
2\. Sistema exibe lista de cursos cadastrados  
3\. Administrador pode adicionar novo curso (informando título, descrição, instrutor, preço e duração)  
4\. Administrador pode atualizar informações de cursos existentes  
5\. Administrador pode excluir cursos não utilizados

Fluxo Alternativo:  
\- Se o curso já possui alunos matriculados, o sistema exibe um alerta antes da exclusão

Fluxo de Exceção:  
\- Se houver erros durante o cadastro ou atualização, o sistema exibe mensagem específica de erro

Caso de Uso 2: Gerenciamento de Alunos  
Ator Principal: Administrador / Aluno

Fluxo Principal:  
1\. Aluno realiza cadastro informando nome, email e senha  
2\. Sistema valida as informações  
3\. Sistema registra o novo aluno  
4\. Administrador pode visualizar e gerenciar todos os alunos cadastrados

Fluxo de Exceção:  
\- Se o email já estiver cadastrado, o sistema notifica o usuário

Caso de Uso 3: Matrícula em Cursos  
Ator Principal: Aluno

Fluxo Principal:  
1\. Aluno faz login no sistema  
2\. Aluno navega pelo catálogo de cursos  
3\. Aluno seleciona um curso e realiza a matrícula  
4\. Sistema registra a matrícula e confirma para o aluno

Fluxo de Exceção:  
\- Se o aluno já estiver matriculado no curso, o sistema notifica sobre a duplicidade

Caso de Uso 4: Emissão de Certificados  
Ator Principal: Sistema/Aluno

Fluxo Principal:  
1\. Aluno concluiu todas as atividades de um curso  
2\. Sistema verifica automaticamente a conclusão  
3\. Sistema gera o certificado com data atual e código de validação  
4\. Sistema disponibiliza o certificado para download na área do aluno

Fluxo de Exceção:  
\- Se houver dados inconsistentes, o sistema notifica o administrador

quero que me ajude continuar a desenvolver esse projeto, baseado nos requisitos que ue fiz por favor me ajude
