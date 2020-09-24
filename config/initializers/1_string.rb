class String
  def strip_all_space!
    gsub!(/(^[[:space:]]+)|([[:space:]]+$)/, '')
  end

  def strip_all_space
    self_clone = clone
    self_clone.strip_all_space!
    self_clone
  end

  def strip_all_space_and_empty_to_nil
    self_clone = clone
    self_clone.strip_all_space!
    self_clone.empty? ? nil : self_clone
  end
end