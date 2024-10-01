# Define the path to the hermes-engine podspec file
podspec_path = '../node_modules/react-native/sdks/hermes-engine/hermes-engine.podspec'

# Check if the file exists
if File.exist?(podspec_path)
  # Read the contents of the podspec file
  text = File.read(podspec_path)

  # Remove the line containing visionos
  new_contents = text.gsub(/ss\.visionos.*$/, '')

  # Write the updated contents back to the file
  File.open(podspec_path, 'w') do |file|
    file.puts new_contents
  end

  puts "Updated hermes-engine.podspec successfully."
else
  puts "Podspec file not found at #{podspec_path}."
end