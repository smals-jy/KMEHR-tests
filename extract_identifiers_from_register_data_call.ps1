# Output of "Register Data" here
$xmlString = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:events xmlns:ns2="http://services.gfddpp.be">
    <pharmaceuticalCareEventType>
        <sguid>e9b4d01a-d685-3722-0163-1ff64f8f3367</sguid>
        <dispensation>
            <dguid>122a88bd-abb3-e528-94ee-10eb13333461</dguid>
            <product>
                <productId>1727395</productId>
            </product>
        </dispensation>
        <dispensation>
            <dguid>acfa5b9f-a758-2f8d-0de2-5acb3c035ab1</dguid>
            <magistral/>
        </dispensation>
        <dispensation>
            <dguid>9e18964b-2473-4b83-31a9-c4f5cdbc6495</dguid>
            <magistral>
                <magistralIds>0589028</magistralIds>
            </magistral>
        </dispensation>
        <dispensation>
            <dguid>5c18a99b-5454-efc3-7600-657a50eb2af5</dguid>
            <magistral>
                <magistralIds>1543305</magistralIds>
                <magistralIds>1543305</magistralIds>
                <magistralIds>0525337</magistralIds>
            </magistral>
        </dispensation>
        <dispensation>
            <dguid>5a974ef9-7e58-5f37-76de-ff678b72c5a1</dguid>
        </dispensation>
    </pharmaceuticalCareEventType>
</ns2:events>
"@

# Load the XML string
$xml = [xml]$xmlString

# Select sguid element
$sguid = $xml.SelectSingleNode("//sguid")

# Select all dguid elements
$dguids = $xml.SelectNodes("//dguid")

# Print sguid element
if ($sguid -ne $null) {
    Write-Host "sguid element:" -NoNewline
    Write-Host " $($sguid.InnerText)"
} else {
    Write-Host "No sguid element found."
}

# Print each dguid element
if ($dguids.Count -gt 0) {
    Write-Host "Found $($dguids.Count) dguid elements:"
    foreach ($dguid in $dguids) {
        Write-Host $dguid.InnerText
    }
} else {
    Write-Host "No dguid elements found."
}