class String
  def strip_all_space!
    gsub!(/(^[[:space:]]+)|([[:space:]]+$)/, '')
  end

  def strip_all_space
    self_clone = clone
    self_clone.strip_all_space!
    self_clone
  end
end