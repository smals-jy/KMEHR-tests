#!/bin/bash
validation_failed=false
FILES="$CI_PROJECT_DIR/output/ms/*.xml"

for f in $FILES
do
    currentFilename=$(basename "$f")
    # Generate Schematron output
    output=$(npx xslt3 "-s:$f" "-xsl:$XSLT_FILE" 2>&1)
    # Extract all <svrl:failed-assert> elements and their content
    failed_asserts=$(xmlstarlet sel -t -m "//svrl:failed-assert" -c . -n - <<< "$output")

    # Check if there are any failed asserts
    if [ -z "$failed_asserts" ]; then
        echo "$currentFilename passed validations"
    else
        echo "$currentFilename failed validations :"
        echo "$failed_asserts"
        echo -e "\n\n"
        validation_failed=true
    fi

done

if [ "$validation_failed" = true ]; then
    exit 1
else
    exit 0
fi
