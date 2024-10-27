generate_sidebar() {
  local dir_path=$1
  local depth=$2

  for entry in "$dir_path"/*; do
    local indent=""
    for ((i=0; i<$depth; i++)); do
      indent+="  "
    done

    if [ -d "$entry" ]; then
      local folder_name=$(basename "$entry")
      echo "${indent}- **$folder_name**" >> public/_sidebar.md
      generate_sidebar "$entry" $((depth + 1))
    elif [ -f "$entry" ]; then
      local file_name=$(basename "$entry")
      local relative_path=${entry#public/}

      # .mdファイルのみを対象にする
      if [[ "$file_name" == *.md ]]; then
        # _で始まるファイルと README.md を除外
        if [[ "$file_name" != _* && "$file_name" != README.md ]]; then
          # 拡張子を除いたファイル名を取得
          local name_without_extension="${file_name%.*}"
          echo "${indent}- [$name_without_extension]($relative_path)" >> public/_sidebar.md
        fi
      fi
    fi
  done
}

# `_sidebar.md`を初期化して再生成
echo "- [Home](/)" > public/_sidebar.md
generate_sidebar "public" 1
