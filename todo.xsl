<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:template match="/">
        <table id="todoList" border="1" class="indent">
            <thead>
                <tr>
                    <th>To be done ⌛</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="//day">
                    <tr>
                        <td colspan="3">
                            <xsl:value-of select="@name"/>
                        </td>
                    </tr>
                    <xsl:for-each select="task">
                        <tr id="{position()}">
                            <td align="left">
                                <input name="task0" type="checkbox"/>
                            </td>
                            <td>
                                <xsl:value-of select="listing"/>
                            </td>
                        </tr>
                    </xsl:for-each>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:transform>
