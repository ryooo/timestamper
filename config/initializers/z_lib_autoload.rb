Dir[format("%<root>s/lib/**/*.rb", root: Rails.root)].sort.each {|lib| require lib }
