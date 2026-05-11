git checkout new-develop

git pull origin new-develop

git merge feature/auth

git push origin new-develop



git checkout -b feature/bautizo

git push -u origin feature/bautizo





**CAMBIAR DE DEVELOP A OTRA RAMA EXISTENTE Y ACTUALIZARLA:**
git checkout feature/auth
git merge new-develop
git add .

git commit -m "Resolver conflictos con new-develop"

git push origin feature/auth

