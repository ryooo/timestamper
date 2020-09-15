module ColorColumn
  def color
    read_attribute(:color) || default_color
  end

  def default_color
    Digest::SHA1.hexdigest(self.id.to_s)[-6..-1]
  end

  def foreground_color
    ((color.hex>>16) * 0.298912 + (color.hex>>8&0xFF)* 0.586611 + (color.hex & 0xFF) * 0.114478) > 128 ? "black" : "white";
  end
  extend ActiveSupport::Concern
end
