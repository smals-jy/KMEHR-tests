# Define the XML elements to remove
$elementsToRemove = @(
    "model:dispensationGUID",
    "smc:header"
)

# Get all XML files in the specified directory
$xmlFiles = Get-ChildItem -Path "./output/pcdh/*.xml"

# Loop through each XML file
foreach ($file in $xmlFiles) {
    # Read the content of the XML file
    $content = Get-Content $file.FullName

    # Loop through each XML element to remove
    foreach ($elementName in $elementsToRemove) {
        $content = $content -replace "<$elementName>.*?</$elementName>", ""
    }

    # Write the modified content back to the file
    $content | Set-Content $file.FullName
}
