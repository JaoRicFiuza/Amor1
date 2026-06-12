# 🚀 Guia para Publicar no GitHub Pages

## Passo 1: Criar um Repositório no GitHub

1. Acesse https://github.com/new
2. Digite o nome do repositório: `amor` (ou outro nome de sua preferência)
3. Deixe como **Public** para que o GitHub Pages funcione
4. Clique em "Create repository"

## Passo 2: Conectar o Repositório Local ao GitHub

Copie e execute os comandos abaixo no terminal (PowerShell) na pasta do projeto:

```powershell
cd "c:\Users\nsn40236\OneDrive - nansen.com.br\Documentos\Amor"

# Adicione o remote origin (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/amor.git

# Renomeie a branch principal para main (padrão do GitHub)
git branch -M main

# Faça push do conteúdo
git push -u origin main
```

## Passo 3: Habilitar GitHub Pages

1. Acesse seu repositório no GitHub: `https://github.com/SEU_USUARIO/amor`
2. Vá em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em "Source", selecione **main branch**
5. Clique em **Save**

## Passo 4: Acessar o Site

Seu site estará disponível em: `https://SEU_USUARIO.github.io/amor`

---

**Nota**: Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub nos comandos acima.

Se tiver dúvidas ou erros, verifique se:
- Você está logado no GitHub
- O repositório foi criado como **Public**
- Os comandos estão corretos com seu username
